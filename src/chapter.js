const timeout = time => new Promise(resolve => setTimeout(resolve, time));

class Chapter {
  static CHARACTER_POSITIONS = [
    [30, 130, 350, 400],
    [480, 130, 350, 400]
  ];

  constructor({ file, text_ui, characters }) {
    this.file = file;
    this.text_ui = text_ui;
    this.characters = characters;

    if (!file) throw new Error('Chapter must have story file');

    this.current_action = -1;
    this.positions = [null, null, null];
    this.substituting_characters = false;
  }

  preload() {
    this.data = loadJSON(this.file);
  }

  execute_action(action) {
    switch (action.type) {
      case 'speech':
        this.text_ui.show_text(action.target, action.text);
        return;
      case 'sub':
        this.substitute_character(action);
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
      this.data[this.current_action + 1] &&
      !this.text_ui.showing &&
      !this.substituting_characters
    );
  }

  show() {
    // If speech has ended, move to next action
    if (this.should_progress()) {
      this.execute_action(this.data[++this.current_action]);
    }

    this.characters.forEach(c => {
      const pos = this.positions.indexOf(c.name);
      if (pos >= 0) c.show(Chapter.CHARACTER_POSITIONS[pos]);
    });
    this.text_ui.show();
  }
}
