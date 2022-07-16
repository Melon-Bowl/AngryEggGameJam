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

    this.sound_names = ['boom4.wav'];
    this.sounds = [];

    this.path = 'assets/music/';
    this.local_sound;
    this.trackPlaying = false;
    this.song_to_play = null;
  }

  preload() {
    soundFormats('mp3');
    for (const name in this.tracks) {
      this.local_sound = loadSound(this.path + this.tracks[name]);
      this.audio_tracks.push(this.local_sound);
    }

    soundFormats('wav');
    this.sounds = this.sound_names.map(sfx => loadSound(`assets/sfx/${sfx}`));
  }

  play_track(song) {
    const track_to_find = `assets/music/${song}.mp3`;
    for (const track in this.audio_tracks) {
      if (this.audio_tracks[track].url === track_to_find) {
        this.song_to_play = this.audio_tracks[track];
        break;
      }
    }
    if (this.trackPlaying === false) {
      this.song_to_play.setVolume(0.3);
      this.song_to_play.setLoop(true);
      this.song_to_play.play();
    }
    this.trackPlaying = true;
  }

  play_sound(sfx) {
    const path = `assets/sfx/${sfx}`;
    const sound = this.sounds.find(t => t.url === path);
    sound.play();
  }
}
