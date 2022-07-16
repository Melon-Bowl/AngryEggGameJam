class Character {
  static TRANSITION_SPEED = 8;
  static TRANSITION_GAP = 400;

  constructor(name, textures) {
    this.name = name;
    this.texture_files = textures;

    if (!this.texture_files.neutral)
      throw new Error('Character must have neutral texture');

    this.textures = {};
    this.current_texture = 'neutral';
    this.transition_mode = null;
    this.transition_progress = 0;
    this.end_transition_callback = null;
  }

  get in_transition() {
    return !!this.transition_mode;
  }

  transition(mode) {
    this.transition_mode = mode;
    this.transition_progress = mode === 'in' ? 0 : 255;
    return new Promise(resolve => (this.end_transition_callback = resolve));
  }

  update_transition() {
    this.transition_progress +=
      (this.transition_mode === 'in' ? 1 : -1) * Character.TRANSITION_SPEED;
    if (this.transition_progress > 255 || this.transition_progress < 0) {
      this.transition_mode = null;
      if (this.end_transition_callback) this.end_transition_callback();
    }
  }

  preload() {
    for (const name in this.texture_files) {
      this.textures[name] = loadImage(this.texture_files[name]);
    }
  }

  show(position) {
    const texture_img = this.textures[this.current_texture];

    if (this.in_transition) tint(255, this.transition_progress);
    this.update_transition();
    image(texture_img, ...position);
    noTint();
  }
}
