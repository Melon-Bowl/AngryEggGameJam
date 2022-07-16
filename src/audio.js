//TODO: Have an audio class that can load all tracks
// Make it so that when it is instantiated in sketch it loads all the tracks

class Tracks {
    constructor(files) {
        this.tracks = files;
        this.path = 'assets/music/';
        this.audio_tracks = [];
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
    }

    play_track(song) {
        const track_to_find = `assets/music/${song}.mp3`
        for (const track in this.audio_tracks) {
            console.log(this.audio_tracks[track])
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
}