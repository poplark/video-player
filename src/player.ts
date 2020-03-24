import { EventEmitter } from 'events';
import { Source } from './source';
import { isNumber } from './common/utils';

export enum PlayerState {
  playing = 0,
  paused = 1,
}

export class Player extends EventEmitter {
  private playerElem: HTMLMediaElement
  private sources: Source[] = []
  private baseTime: number = 0
  private _currentTime: number = 0
  private currentSource?: Source

  get currentTime(): number {
    return this._currentTime;
  }

  private _duration: number = 0
  get duration(): number {
    return this._duration;
  }
  set duration(time: number) {
    this._duration = time;
    this.emit('duration-changed', this._duration);
  }

  private _state: PlayerState = PlayerState.paused
  get state(): PlayerState {
    return this._state;
  }

  constructor(player: HTMLMediaElement) {
    super();
    this.playerElem = player;
  }

  onPlay = () => {
    console.log('play ', this.playerElem.currentTime);
    this.emit('play', this.currentSource);
    this._state = PlayerState.playing;
  }

  onPause = () => {
    console.log('pause ', this.playerElem.currentTime);
    this.emit('pause', this.currentSource);
    this._state = PlayerState.paused;
  }

  onTimeUpdate = () => {
    this._currentTime = this.baseTime + this.playerElem.currentTime;
    this.emit('currentTime', this.currentTime);
  }

  onEnded = () => {
    console.log('ended ', this.playerElem.currentTime);
    if (this.currentSource) {
      this.play(this.baseTime + this.currentSource?.duration);
    }
  }

  load() {
    this.playerElem.addEventListener('play', this.onPlay);
    this.playerElem.addEventListener('timeupdate', this.onTimeUpdate);
    this.playerElem.addEventListener('ended', this.onEnded);
    this.playerElem.addEventListener('pause', this.onPause);
  }

  unload() {
    this.playerElem.removeEventListener('play', this.onPlay);
    this.playerElem.removeEventListener('timeupdate', this.onTimeUpdate);
    this.playerElem.removeEventListener('ended', this.onEnded);
    this.playerElem.removeEventListener('pause', this.onPause);
    this.playerElem.currentTime = 0;
  }

  addSource(uri: string) {
    const source = new Source(uri);
    source.on('ready', () => {
      this.duration += source.duration;
    });
    // todo source off eventlisenter
    this.sources.push(source);
  }

  // todo
  removeSource() { }

  playSource(source: Source) {
    if (this.currentSource) {
      this.unload();
    }
    this.currentSource = source;
    this.playerElem.replaceWith(source.videoElem);
    this.playerElem = source.videoElem;
    this.load();
  }

  play(time?: number): Promise<any> {
    let source: Source;
    // todo - 判断 this.sources 是否为空
    let start: number = 0;
    if (isNumber(time)) {
      // find source
      const idx = this.sources.findIndex(item => {
        let end = start + item.duration;
        if (<number>time < end) {
          return true;
        }
        start = end;
        return false;
      });
      if (idx >= 0) {
        source = this.sources[idx];
      } else {
        // todo 判断是否为 loop，若为 loop，才播第一个，否则就 pause
        start = 0;
        time = 0;
        source = this.sources[0];
      }
    } else {
      time = 0;
      source = this.sources[0];
    }
    this.baseTime = start;
    this._currentTime = <number>time;
    if (this.currentSource !== source) {
      this.playSource(source);
    }
    this.playerElem.currentTime = this.currentTime - this.baseTime;
    return this.playerElem.play();
  }

  pause() {
    this.playerElem.pause();
  }
}
