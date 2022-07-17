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

  play_theme() {
    switch (this.dead_char) {
      case 'Lucy':
        return this.music.play_track('bad_ending');
      case 'Gryphon':
        return this.music.play_track('bad_ending');
      case 'Amogus':
        return this.music.play_track('bad_ending');
      case 'Chad':
        return this.music.play_track('bad_ending');
      default: // No one dies
        return this.music.play_track('bad_ending');
    }
  }
}
