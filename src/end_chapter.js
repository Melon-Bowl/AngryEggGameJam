class EndChapter extends Chapter {
  get dead_char() {
    return this.boomer.boomed_character || null;
  }

  get scenes() {
    return this._scenes.filter(s => s.ending_name === this.dead_char);
  }

  preload() {
    this._scenes = this.scene_files.map(s => loadJSON(s));
  }
}
