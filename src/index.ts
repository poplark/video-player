import videojs from 'video.js';

export class VideoPlayer {
  constructor() {
    console.log('vvvv ', videojs);
  }

  play(elem: HTMLVideoElement) {
    console.log('eeeee ', elem);
  }
}