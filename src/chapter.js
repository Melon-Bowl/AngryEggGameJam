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
        this.positions[action.position] = action.target || null;
        return;
      default:
        throw new Error('Unknown action type found in chapter: ' + action.type);
    }
  }

  show() {
    // If speech has ended, move to next action
    if (!this.text_ui.showing && this.data[this.current_action + 1]) {
      this.execute_action(this.data[++this.current_action]);
    }

    this.characters.forEach(c => {
      const pos = this.positions.indexOf(c.name);
      if (pos >= 0) c.show(Chapter.CHARACTER_POSITIONS[pos]);
    });
    this.text_ui.show();
  }
}
