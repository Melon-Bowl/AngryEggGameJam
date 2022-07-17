class SceneManager {
  static CHAPTER_TITLE_DURATION = 1500;
  static DEFAULT_FADE_SPEED = 1;

  constructor({ text_ui, characters, backgrounds, music, boomer, store, die }) {
    this.store = store;
    this.boomer = boomer;
    this.music = music;

    this.menu = new MenuManager({ backgrounds });

    this.chapters = [
      new Chapter({
        index: 0,
        text_ui,
        characters,
        backgrounds,
        music,
        boomer,
        die,
        scenes: [
          'src/scenes/1-1.json',
          'src/scenes/1-2.json',
          'src/scenes/1-3.json'
        ],
        total_boom_chances: [0, 0, 0]
      }),
      new Chapter({
        index: 1,
        text_ui,
        characters,
        backgrounds,
        music,
        boomer,
        die,
        total_boom_chances: [0.9, 0.9, 0.9],
        scenes: [
          'src/scenes/2-1.json',
          'src/scenes/2-2.json',
          'src/scenes/2-3.json'
        ]
      }),
      new EndChapter({
        index: 2,
        text_ui,
        characters,
        backgrounds,
        music,
        boomer,
        die,
        total_boom_chances: [0],
        scenes: [
          'src/scenes/3-1.json',
          'src/scenes/3-2.json',
          'src/scenes/3-3.json'
        ]
      })
    ];
    this.current_chapter = 0;

    this.state = '';

    this.fade_mode = null;
    this.fade_speed = 1;
    this.fade_progress = null;
    this.end_fade_callback = null;

    this.end_button = new Button(
      'Play Again',
      [250, 600 * 0.55 - 30, 300, 60],
      () => this.restart_game()
    );
  }

  restart_game() {
    this.store.remove_cache();
    window.location.reload();
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
    switch (this.state) {
      case 'menu':
        return this.menu.handle_click();
      case 'end':
        return this.end_button.handle_click();
      default:
        return;
    }
  }

  preload() {
    this.chapters.forEach(c => c.preload());
  }

  async setup() {
    const cache = this.store.read_from_cache();
    if (!cache) {
      this.state = 'menu';
      await this.menu.wait_for_play();
      await this.fade('out', 5);
    } else {
      this.current_chapter = cache.chapter;
    }

    for (const chapter of this.chapters.slice(this.current_chapter)) {
      this.state = 'title';
      await this.fade('in', 3);
      await timeout(SceneManager.CHAPTER_TITLE_DURATION);
      await this.fade('out', 4);
      this.state = 'in-scene';

      let prev_history = [];
      let scenes_to_show = [];
      if (chapter instanceof EndChapter) {
        scenes_to_show = chapter.scenes.length ? [0] : [];
      } else {
        if (cache && cache.chapter === this.current_chapter) {
          scenes_to_show = chapter.scenes
            .map((a, i) => i)
            .filter(i => !cache.scenes.includes(i));
          shuffle(scenes_to_show, true);
          prev_history = cache.scenes.slice(0, cache.scenes.length - 1);
          scenes_to_show.unshift(cache.scenes[cache.scenes.length - 1]);
        } else {
          scenes_to_show = shuffle(chapter.scenes.map((a, i) => i));
        }
      }

      for (const scene_index of scenes_to_show) {
        const scene_history = [
          ...prev_history,
          ...scenes_to_show.slice(0, scenes_to_show.indexOf(scene_index) + 1)
        ];
        const scene = chapter.start_next_scene(
          scene_index,
          scene_history.length - 1
        );
        this.store.save_to_cache(this.current_chapter, scene_history);
        await this.fade('in');
        chapter.allowed_to_progress = true;
        await scene;
        chapter.allowed_to_progress = false;
        await this.fade('out', 4);
        if (this.boomer.boomed_character) break;
      }
      this.music.stop();
      this.current_chapter++;
    }
    this.state = 'end';
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
    text('The End', width / 2, height * 0.4);

    textSize(30);
    this.end_button.show();

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
