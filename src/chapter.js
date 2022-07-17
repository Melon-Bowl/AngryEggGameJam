class Chapter {
  static CHARACTER_POSITIONS = [
    [30, 130, 300, 550],
    [480, 130, 300, 550]
  ];

  constructor({
    index,
    scenes,
    text_ui,
    music,
    characters,
    backgrounds,
    boomer,
    die,
    total_boom_chances
  }) {
    this.index = index;
    this.scene_files = scenes;
    this.text_ui = text_ui;
    this.characters = characters;
    this.backgrounds = backgrounds;
    this.music = music;
    this.boomer = boomer;
    this.die = die;
    this.total_boom_chances = total_boom_chances || this.scene_files.fill(0);

    if (!scenes || !scenes.length)
      throw new Error('Chapter must have story file');

    this.current_scene = -1;
    this.data = null;
    this.background = null;

    this.current_action = -1;
    this.positions = [null, null];
    this.substituting_characters = false;

    this.allowed_to_progress = false;
    this.end_scene = null;

    this.boom_chances = {};
    this.is_booming = false;
  }

  preload() {
    this.scenes = this.scene_files.map(s => loadJSON(s));
  }

  /**
   * @param {Number} to_scene Scene to next show
   * @param {Number} scene_index How many scenes have been shown from this chapter subtract 1
   */
  start_next_scene(to_scene, scene_index) {
    this.play_theme();
    this.current_scene = to_scene;
    const scene = this.scenes[to_scene];
    this.background = scene.background;
    this.data = scene.actions;
    this.calc_boom_chances(scene_index);
    this.current_action = -1;
    this.positions = [null, null, null];
    this.characters.forEach(c => c.set_texture('neutral'));
    return new Promise(resolve => (this.end_scene = resolve));
  }

  play_theme() {
    if (this.index === 0) this.music.play_track('chapter_1');
    else this.music.play_track('main_theme');
  }

  count_boom_opportunities_for_char(char_name) {
    const witnesses = ['Lucy', 'Gryphon'].filter(n => n !== char_name);

    const opps = [];
    const current_witnesses = [null, null];
    for (let i = 0; i < this.data.length; i++) {
      const action = this.data[i];
      switch (action.type) {
        case 'sub':
          current_witnesses[action.position] = action.target;
          const other = current_witnesses[action.position ? 0 : 1];
          current_witnesses[action.position ? 0 : 1] =
            other === action.target ? null : other;
          break;
        case 'speech':
          if (
            current_witnesses.some(w => witnesses.includes(w)) &&
            current_witnesses.includes(char_name)
          )
            opps.push(i);
          break;
        default:
          break;
      }
    }
    return opps;
  }

  calc_individual_boom_prob(total_chance, char_name) {
    if (!total_chance) return [0, []];
    const opps = this.count_boom_opportunities_for_char(char_name);
    if (!opps.length) return [0, []];

    // n := count of opp.
    // P := total chance
    // p := individual chance (to solve for)

    // Failed calculation
    // P = (n choose 1) * (p) * (1 - p)^(n - 1)
    // P = np * (1 - p)^(n - 1)

    // Next attempt
    // X ~ B(n, p)
    // P = P(X > 0) = 1 - P(X = 0)
    // P(X = 0) = (1 - p)^n
    // P = 1 - (1 - p)^n
    // 1 - P = (1 - p)^n
    // 1 - p = (1 - P)^(1 / n)
    // p = 1 - (1 - P)^(1 / n)

    const p = 1 - Math.pow(1 - total_chance, 1 / opps.length);

    return [p, opps];
  }

  calc_boom_chances(scene_index) {
    this.boom_chances = this.characters
      .map(c => c.name)
      .reduce((acc, cur) => {
        const [p, opps] = this.calc_individual_boom_prob(
          this.total_boom_chances[scene_index],
          cur
        );
        return { ...acc, [cur]: { p, opps } };
      }, {});
  }

  async execute_action(action, boom_message = false) {
    switch (action.type) {
      case 'speech':
        await this.text_ui.show_text(action.target, action.text);

        if (boom_message || this.boomer.boomed_character) return;
        for (const c of this.characters) {
          const can_boom = this.boom_chances[c.name].opps.includes(
            this.data.indexOf(action)
          );
          if (can_boom && Math.random() < this.boom_chances[c.name].p) {
            this.boom(this.positions.indexOf(c.name));
            return;
          }
        }
        return;
      case 'sub':
        return this.substitute_character(action);
      case 'texture':
        const character = this.characters.find(c => c.name === action.target);
        return character.set_texture(action.texture);
      case 'play_sound':
        return this.music.play_track(action.track || 'chapter_1');
      default:
        throw new Error('Unknown action type found in chapter: ' + action.type);
    }
  }

  async boom(position) {
    this.is_booming = true;
    const small_chars = [];
    const prev_textures = [];

    this.die.throw();

    this.positions.forEach((name, i) => {
      if (!name || i === position) return;
      const char = this.characters.find(c => c.name === name);
      if (char.has_texture('smol')) {
        small_chars.push(char);
        prev_textures.push(char.current_texture);
        char.set_texture('smol');
      }
    });

    await this.execute_action(
      {
        type: 'speech',
        target: this.positions[position],
        text: 'Roll of the dice'
      },
      true
    );

    this.die.land();

    const explosion = this.boomer.boom(
      Chapter.CHARACTER_POSITIONS[position],
      this.positions[position],
      this.index
    );
    await this.substitute_character({ target: null, position, quick: true });
    await explosion;

    small_chars.forEach((c, i) => c.set_texture(prev_textures[i]));
    this.is_booming = false;
  }

  async substitute_character({ target, position, quick }) {
    this.substituting_characters = true;
    const enter_char = target && this.characters.find(c => c.name === target);
    const exit_char =
      this.positions[position] &&
      this.characters.find(c => c.name === this.positions[position]);
    const current_pos = target ? this.positions.indexOf(target) : -1;

    if (exit_char) {
      await exit_char.transition('out');
      this.positions[position] = null;
      await timeout(quick ? 15 : Character.TRANSITION_GAP);
    }
    if (current_pos >= 0) {
      await enter_char.transition('out');
      this.positions[current_pos] = null;
      await timeout(quick ? 15 : Character.TRANSITION_GAP);
    }
    if (enter_char) {
      this.positions[position] = target;
      await enter_char.transition('in');
    }
    this.substituting_characters = false;
  }

  should_progress() {
    return (
      //this.data[this.current_action + 1] &&
      !this.text_ui.showing &&
      !this.substituting_characters &&
      this.allowed_to_progress &&
      !this.is_booming
    );
  }

  show() {
    background(this.backgrounds[this.background]);

    const current_speaker = this.text_ui.speaking && this.text_ui.name;

    this.characters.forEach(c => {
      const pos = this.positions.indexOf(c.name);
      if (pos >= 0) {
        c.show(Chapter.CHARACTER_POSITIONS[pos], c.name === current_speaker);
      }
    });
    this.text_ui.show();

    if (this.should_progress()) {
      if (
        this.boomer.boomed_character &&
        this.boomer.boomed_chapter === this.index
      )
        return this.end_scene();

      this.current_action++;
      if (!this.data[this.current_action]) return this.end_scene();
      this.execute_action(this.data[this.current_action]);
    }
  }
}
