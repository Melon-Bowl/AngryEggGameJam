class Button {
  constructor(text, rect, onclick) {
    this.text = text;
    this.rect = rect;
    this.onclick = onclick || (() => 0);
  }

  show(opacity = 255) {
    if (this.contains_mouse()) cursor('pointer');

    strokeWeight(3);
    const button_opacity =
      (opacity * (this.contains_mouse() ? 255 : 235)) / 255;
    fill(255, button_opacity);
    stroke(0, opacity);
    rect(...this.rect);

    textAlign(CENTER, CENTER);
    stroke(0, opacity);
    strokeWeight(2);
    fill(0, opacity);
    text(this.text, ...this.rect);
  }

  contains_mouse() {
    const [x, y, w, h] = this.rect;
    if (mouseX < x) return false;
    if (mouseX > x + w) return false;
    if (mouseY < y) return false;
    if (mouseY > y + h) return false;
    return true;
  }

  handle_click() {
    if (this.contains_mouse()) this.onclick();
  }
}

class MenuManager {
  constructor({ backgrounds }) {
    this.backgrounds = backgrounds;

    this.on_play = () => console.error('No on play func');

    this.buttons = [
      new Button('Play', [250, 600 * 0.45, 300, 75], () => this.on_play()),
      new Button('Credits', [250, 600 * 0.65, 300, 75], this.on_credits)
    ];
  }

  wait_for_play() {
    return new Promise(resolve => (this.on_play = resolve));
  }

  on_credits = () => {};

  handle_click() {
    this.buttons.forEach(b => b.handle_click());
  }

  show(opacity) {
    background(this.backgrounds['school.png']);

    // Title
    textAlign(CENTER, CENTER);
    textSize(80);
    fill(255, opacity);
    stroke(0, opacity);
    strokeWeight(5);
    text('Our Game', width / 2, height * 0.3);

    // Buttons
    textSize(40);
    this.buttons.forEach(b => b.show(opacity));
  }
}
