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
  constructor({ backgrounds, start_credits }) {
    this.backgrounds = backgrounds;
    this.start_credits = start_credits;

    this.on_play = () => console.error('No on play func');

    this.buttons = [
      new Button('Play', [250, 600 * 0.45, 300, 75], () => this.on_play()),
      new Button('Credits', [250, 600 * 0.65, 300, 75], () => start_credits())
    ];
  }

  wait_for_play() {
    return new Promise(resolve => (this.on_play = resolve));
  }

  handle_click() {
    this.buttons.forEach(b => b.handle_click());
  }

  show(opacity) {
    background(this.backgrounds['school.png']);

    // Title
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(255, opacity);
    stroke(0, opacity);
    strokeWeight(5);
    text(`Don't say "Roll of the dice"`, width / 2, height * 0.2);
    text(`Or you will boom!`, width / 2, height * 0.3);

    // Version
    textAlign(LEFT, BOTTOM);
    textSize(16);
    strokeWeight(3);
    text('Version ' + GAME_VERSION, 10, height - 10);

    // Buttons
    textSize(40);
    this.buttons.forEach(b => b.show(opacity));
  }
}
