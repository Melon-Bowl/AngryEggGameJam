class Chapter {
  static CHARACTER_POSITIONS = [
    [30, 130, 300, 550],
    [480, 130, 300, 550]
  ];

  constructor({ scenes, text_ui, music, characters, backgrounds, boomer }) {
    this.scene_files = scenes;
    this.text_ui = text_ui;
    this.characters = characters;
    this.backgrounds = backgrounds;
    this.music = music;
    this.boomer = boomer;

    if (!scenes || !scenes.length)
      throw new Error('Chapter must have story file');

    this.current_scene = -1;
    this.data = null;
    this.background = null;

    this.current_action = -1;
    this.positions = [null, null, null];
    this.substituting_characters = false;

    this.allowed_to_progress = false;
    this.end_scene = null;
  }

  preload() {
    this.scenes = this.scene_files.map(s => loadJSON(s));
  }

  start_next_scene(to_scene) {
    this.current_scene = to_scene;
    const scene = this.scenes[to_scene];
    this.background = scene.background;
    this.data = scene.actions;
    this.current_action = -1;
    this.positions = [null, null, null];
    return new Promise(resolve => (this.end_scene = resolve));
  }

  execute_action(action) {
    switch (action.type) {
      case 'speech':
        return this.text_ui.show_text(action.target, action.text);
      case 'sub':
        return this.substitute_character(action);
      case 'texture':
        const character = this.characters.find(c => c.name === action.target);
        return character.set_texture(action.texture);
      case 'play_sound':
        return this.music.play_track('chapter_1');
      case 'boom':
        return this.boom(action.position);
      default:
        throw new Error('Unknown action type found in chapter: ' + action.type);
    }
  }

  async boom(position) {
    const small_chars = [];
    const prev_textures = [];

    this.positions.forEach((name, i) => {
      if (!name || i === position) return;
      const char = this.characters.find(c => c.name === name);
      if (char.has_texture('small')) {
        small_chars.push(char);
        prev_textures.push(char.current_texture);
        char.set_texture('small');
      }
    });

    const explosion = this.boomer.boom(Chapter.CHARACTER_POSITIONS[position]);
    await this.substitute_character({ target: null, position, quick: true });
    await explosion;

    small_chars.forEach((c, i) => c.set_texture(prev_textures[i]));
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
      this.allowed_to_progress
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
      this.current_action++;
      if (!this.data[this.current_action]) return this.end_scene();
      this.execute_action(this.data[this.current_action]);
    }
  }
}
