class DieController {
  static POSITION = [720, 10, 70, 70];

  constructor() {
    this.faces = [];
    this.current_face = 0;
    this.rolling = false;
  }

  preload() {
    this.faces = [
      loadImage('assets/dice/1.png'),
      loadImage('assets/dice/2.png'),
      loadImage('assets/dice/3.png'),
      loadImage('assets/dice/4.png'),
      loadImage('assets/dice/5.png'),
      loadImage('assets/dice/6.png')
    ];
  }

  throw() {
    this.rolling = true;
  }

  land() {
    if (!this.rolling) return null;
    this.rolling = false;
    return this.current_face + 1;
  }

  show() {
    if (this.rolling) this.current_face = floor(random(6));
    image(this.faces[this.current_face], ...DieController.POSITION);
  }
}
