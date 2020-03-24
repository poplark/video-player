import { EventEmitter } from 'events';
import { isNumber } from './common/utils';

enum SourceState {
  init = 0,
  loading = 1,
  ready = 2
}

export class Source extends EventEmitter {
  state: SourceState = SourceState.init
  url: string

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

  private loadMeta() {
    this.state = SourceState.loading;
    let video = document.createElement('video');
    video.onloadedmetadata = () => {
      this.duration = video.duration;
    }
    video.src = this.url;
  }

  constructor(url: string, duration?: number) {
    super();
    this.url = url;
    if (isNumber(duration)) {
      this.duration = <number>duration;
    } else {
      this.loadMeta();
    }
  }
}
