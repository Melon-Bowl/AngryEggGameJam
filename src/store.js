class StorageManager {
  static CACHE_KEY = 'angryegggame-boom-current-scene';

  static TOAST_SPEED = 3;
  static HOVER_DURATION = 2000;
  static START_Y = -10;
  static END_Y = 30;

  constructor({ boomer }) {
    this.boomer = boomer;

    this.toast_active = false;
    this.transition_mode = null;
    this.transition_progress = 0;
    this.end_transition_callback = null;
  }

  read_from_cache() {
    const val = localStorage.getItem(StorageManager.CACHE_KEY);
    if (!val) return null;
    const { chapter, scenes, boomed_character, timestamp } = JSON.parse(val);
    if (new Date() - timestamp > 1000 * 3600 * 3) return null;
    this.send_toast();

    if (chapter === 2 && boomed_character) {
      this.boomer.boomed_character = boomed_character;
      this.boomer.boomed_chapter = 1;
    }

    return { chapter, scenes };
  }

  save_to_cache(chapter, scenes) {
    localStorage.setItem(
      StorageManager.CACHE_KEY,
      JSON.stringify({
        chapter,
        scenes,
        boomed_character: this.boomer.boomed_character || null,
        timestamp: new Date()
      })
    );
  }

  remove_cache() {
    localStorage.removeItem(StorageManager.CACHE_KEY);
  }

  get in_transition() {
    return !!this.transition_mode;
  }

  async send_toast() {
    this.toast_active = true;
    await this.transition('down');
    await timeout(StorageManager.HOVER_DURATION);
    await this.transition('up');
    this.toast_active = false;
  }

  transition(mode) {
    this.transition_mode = mode;
    this.transition_progress =
      StorageManager[mode === 'down' ? 'START_Y' : 'END_Y'];
    return new Promise(resolve => (this.end_transition_callback = resolve));
  }

  update_transition() {
    this.transition_progress +=
      (this.transition_mode === 'down' ? 1 : -1) * StorageManager.TOAST_SPEED;
    if (
      this.transition_progress > StorageManager.END_Y ||
      this.transition_progress < StorageManager.START_Y
    ) {
      this.transition_mode = null;
      if (this.end_transition_callback) this.end_transition_callback();
      return true;
    }
  }

  show() {
    if (!this.toast_active) return;

    const pos = [
      width / 2,
      this.in_transition ? this.transition_progress : StorageManager.END_Y
    ];
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(0);
    strokeWeight(1);
    textSize(20);
    text('Retrieved current scene from storage', ...pos);

    this.update_transition();
  }
}
