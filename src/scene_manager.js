class SceneManager {
  static CHAPTER_TITLE_DURATION = 1500;
  static DEFAULT_FADE_SPEED = 1;

  constructor({ text_ui, characters, backgrounds, music }) {
    this.menu = new MenuManager({ backgrounds });

    this.chapters = [
      new Chapter({
        text_ui,
        characters,
        backgrounds,
        music,
        scenes: ['src/scenes/1-1.json', 'src/scenes/1-2.json']
      })
    ];
    this.current_chapter = 0;

    this.state = '';

    this.fade_mode = null;
    this.fade_speed = 1;
    this.fade_progress = null;
    this.end_fade_callback = null;
  }

  get is_fading() {
    return !!this.fade_mode;
  }

  fade(mode, speed = SceneManager.DEFAULT_FADE_SPEED) {
    this.fade_mode = mode;
    this.fade_speed = speed;
    this.fade_progress = mode === 'in' ? 0 : 255;
    return new Promise(resolve => (this.end_fade_callback = resolve));
  }

  update_fade() {
    this.fade_progress += (this.fade_mode === 'in' ? 1 : -1) * this.fade_speed;
    if (this.fade_progress > 255 || this.fade_progress < 0) {
      this.fade_mode = null;
      if (this.end_fade_callback) this.end_fade_callback();
      return true;
    }
  }

  handle_click() {
    if (this.state === 'menu') this.menu.handle_click();
  }

  preload() {
    this.chapters.forEach(c => c.preload());
  }

  async setup() {
    this.state = 'menu';
    await this.menu.wait_for_play();
    await this.fade('out', 5);

    for (const chapter of this.chapters) {
      this.state = 'title';
      await this.fade('in', 3);
      await timeout(SceneManager.CHAPTER_TITLE_DURATION);
      await this.fade('out', 4);
      this.state = 'in-scene';
      for (let i = 0; i < chapter.scenes.length; i++) {
        const scene = chapter.start_next_scene();
        await this.fade('in');
        chapter.allowed_to_progress = true;
        await scene;
        chapter.allowed_to_progress = false;
        await this.fade('out', 4);
      }
      this.state = 'end';
    }
  }

  show_chapter_title() {
    push();
    background(0);
    textAlign(CENTER, CENTER);
    strokeWeight(0);
    fill(255, this.is_fading ? this.fade_progress : 255);
    textSize(80);
    const chapter_name = `Chapter ${this.current_chapter + 1}`;
    text(chapter_name, width / 2, height / 2);
    pop();
  }

  show_end() {
    push();
    background(0);
    textAlign(CENTER, CENTER);
    strokeWeight(0);
    fill(255, this.is_fading ? this.fade_progress : 255);
    textSize(80);
    text('The End', width / 2, height * 0.45);

    textSize(20);
    text('Refresh to play again...', width / 2, height * 0.6);
    pop();
  }

  show() {
    if (this.is_fading) {
      const opacity = this.fade_progress;
      if (this.update_fade()) return;
      background(0);
      tint(255, opacity);
    }

    switch (this.state) {
      case 'menu':
        return this.menu.show(this.is_fading ? this.fade_progress : 255);
      case 'end':
        return this.show_end();
      case 'title':
        return this.show_chapter_title();
      case 'in-scene':
        return this.chapters[this.current_chapter].show();
      default:
        throw new Error('Unknown scene manager state: ' + this.state);
    }
  }
}