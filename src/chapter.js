const timeout = time => new Promise(resolve => setTimeout(resolve, time));

class Chapter {
  static CHARACTER_POSITIONS = [
    [30, 130, 300, 550],
    [480, 130, 300, 550]
  ];

  constructor({ scenes, text_ui, characters, backgrounds }) {
    this.scene_files = scenes;
    this.text_ui = text_ui;
    this.characters = characters;
    this.backgrounds = backgrounds;

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

  start_next_scene() {
    const scene = this.scenes[++this.current_scene];
    this.background = scene.background;
    this.data = scene.actions;
    return new Promise(resolve => (this.end_scene = resolve));
  }

  execute_action(action) {
    switch (action.type) {
      case 'speech':
        this.text_ui.show_text(action.target, action.text);
        return;
      case 'sub':
        this.substitute_character(action);
        return;
      case 'texture':
        const character = this.characters.find(c => c.name === action.target);
        character.set_texture(action.texture);
        return;
      default:
        throw new Error('Unknown action type found in chapter: ' + action.type);
    }
  }

  async substitute_character({ target, position }) {
    this.substituting_characters = true;
    const enter_char = target && this.characters.find(c => c.name === target);
    const exit_char =
      this.positions[position] &&
      this.characters.find(c => c.name === this.positions[position]);
    const current_pos = target ? this.positions.indexOf(target) : -1;

    if (exit_char) {
      await exit_char.transition('out');
      this.positions[position] = null;
      await timeout(Character.TRANSITION_GAP);
    }
    if (current_pos >= 0) {
      await enter_char.transition('out');
      this.positions[current_pos] = null;
      await timeout(Character.TRANSITION_GAP);
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

    if (!this.data[this.current_action + 1]) return this.end_scene();

    if (this.should_progress()) {
      this.execute_action(this.data[++this.current_action]);
    }

    const current_speaker = this.text_ui.speaking && this.text_ui.name;

    this.characters.forEach(c => {
      const pos = this.positions.indexOf(c.name);
      if (pos >= 0) {
        c.show(Chapter.CHARACTER_POSITIONS[pos], c.name === current_speaker);
      }
    });
    this.text_ui.show();
  }
}
