import { EventEmitter } from 'events';

enum SourceState {
  init = 0,
  loading = 1,
  ready = 2
}

export class Source extends EventEmitter {
  videoElem: HTMLVideoElement
  state: SourceState = SourceState.init
  uri: string

  _duration: number = 0
  get duration(): number {
    return this._duration;
  }
  set duration(sec: number) {
    this._duration = sec;
    if (this.state !== SourceState.ready) {
      this.state = SourceState.ready;
      this.emit('ready');
    }
  }

  constructor(uri: string) {
    super();
    this.uri = uri;
    this.videoElem = document.createElement('video');
    this.init();
  }

  private init() {
    this.state = SourceState.loading;
    this.videoElem.preload = 'auto';
    this.videoElem.onloadedmetadata = () => {
      this.duration = this.videoElem.duration;
    }
    this.videoElem.src = this.uri;
  }
}
