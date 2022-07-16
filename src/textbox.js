class TextBox {
  static NAME_RECT = [60, 337, 170, 35];
  static TEXT_RECT = [88, 413, 610, 140];

  constructor() {
    this.assets = {
      ui: null
    };

    this.name = null;
    this.text = null;
    this.text_index = 0;
  }

  get showing() {
    return !!this.name;
  }

  get speaking() {
    return this.showing && this.text_index < this.text.length;
  }

  preload() {
    this.assets.ui = loadImage('assets/speech-ui.png');
  }

  show() {
    image(this.assets.ui, 0, 0, width, height);

    if (this.name) {
      textSize(22);
      textAlign(CENTER, CENTER);
      text(this.name, ...TextBox.NAME_RECT);

      textSize(18);
      textAlign(LEFT, TOP);
      text(this.text.slice(0, ++this.text_index), ...TextBox.TEXT_RECT);
    }
  }

  show_text(name, text) {
    this.name = name;
    this.text = text;
    this.text_index = 0;
  }

  clear_text() {
    this.name = null;
  }

  _mouse_in_text_area() {
    const [x, y, w, h] = TextBox.TEXT_RECT;
    if (mouseX < x) return false;
    if (mouseX > x + w) return false;
    if (mouseY < y) return false;
    if (mouseY > y + h) return false;
    return true;
  }

  handle_click() {
    // If click in the text rect, skip to end of text
    if (this.name && this._mouse_in_text_area()) {
      if (this.speaking) {
        this.text_index = this.text.length;
      } else {
        this.clear_text();
      }
    }
  }
}
