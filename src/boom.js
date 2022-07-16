class BoomController {
  static GIF_DURATION = 750;

  constructor({ music }) {
    this.music = music;

    this.boom_path = 'assets/boom.gif';
    this.boom_gif = null;
    this.boom_width = 300;
  }

  set_canvas(cnv) {
    cnv.elt.parentElement.style.position = 'relative';
    this.boom_gif.parent(cnv.elt.parentElement);
  }

  preload() {
    this.boom_gif = createImg(this.boom_path, 'boom');
    this.boom_gif.hide();
    this.boom_gif.style('width', `${this.boom_width}px`);
    this.boom_gif.style('height', 'auto');
  }

  calc_pos_from_rect(rect) {
    const [x, y, w, h] = rect;
    const [midx, midy] = [x + w / 2, y + h / 2];
    const boom_height =
      (this.boom_width / this.boom_gif.width) * this.boom_gif.height;

    return [midx - this.boom_width / 2, midy - boom_height / 2];
  }

  async boom(rect) {
    const pos = this.calc_pos_from_rect(rect);
    this.boom_gif.position(...pos);
    this.boom_gif.removeAttribute('src');
    this.boom_gif.show();

    this.music.play_sound('boom4.wav');
    this.boom_gif.attribute('src', this.boom_path);
    await timeout(BoomController.GIF_DURATION);

    this.boom_gif.hide();
  }
}
