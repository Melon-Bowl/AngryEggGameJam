class Tracks {
  constructor() {
    this.tracks = [
      'chapter_1.mp3',
      'main_theme.mp3',
      'boom_theme.mp3',
      'good_ending.mp3',
      'bad_ending.mp3',
      'secret_ending2.mp3'
    ];
    this.audio_tracks = [];

    this.current_song = null;
    this.current_track = null;

    this.sound_names = ['boom4.wav'];
    this.sounds = [];

    this.path = 'assets/music/';
  }

  preload() {
    soundFormats('mp3');
    for (const name in this.tracks) {
      this.audio_tracks.push(loadSound(this.path + this.tracks[name]));
    }

    soundFormats('wav');
    this.sounds = this.sound_names.map(sfx => loadSound(`assets/sfx/${sfx}`));
  }

  play_track(song) {
    if (song === this.current_song) return;
    this.current_song = song;

    if (this.current_track) this.stop();

    const track_to_find = `assets/music/${song}.mp3`;
    this.current_track = this.audio_tracks.find(t => t.url === track_to_find);

    this.current_track.setVolume(0.3);
    this.current_track.setLoop(true);
    this.current_track.play();
  }

  stop() {
    this.current_track.stop();
  }

  play_sound(sfx) {
    const path = `assets/sfx/${sfx}`;
    const sound = this.sounds.find(t => t.url === path);
    sound.play();
  }
}
