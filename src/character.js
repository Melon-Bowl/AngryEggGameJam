class Character {
  constructor(name, textures) {
    this.name = name;
    this.texture_files = textures;

    if (!this.texture_files.neutral)
      throw new Error('Character must have neutral texture');

    this.textures = {};
    this.current_texture = 'neutral';
  }

  preload() {
    for (const name in this.texture_files) {
      this.textures[name] = loadImage(this.texture_files[name]);
    }
  }

  show(position) {
    const texture_img = this.textures[this.current_texture];
    image(texture_img, ...position);
  }
}
