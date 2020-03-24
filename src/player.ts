import { EventEmitter } from 'events';
import { Source } from './source';
import { isNumber } from './common/utils';

export class Player extends EventEmitter {
  private player: HTMLMediaElement
  private sources: Source[] = []
  private baseTime: number = 0
  private currentTime: number = 0
  private currentSource?: Source

  private _duration: number = 0
  get duration(): number {
    return this._duration
  }
  set duration(time: number) {
    this._duration = time;
    this.emit('duration-changed', this._duration);
  }

  constructor(player: HTMLMediaElement) {
    super();
    this.player = player;
    player.addEventListener('play', () => {
      console.log('play ', player.currentTime);
      this.emit('play', this.currentSource);
    });
    player.addEventListener('playing', () => {
      console.log('playing ', player.currentTime);
    });
    player.addEventListener('progress', () => {
      console.log('progress ', player.currentTime);
    });
    player.addEventListener('timeupdate', () => {
      // console.log('timeupdate ', player.currentTime);
      this.currentTime = this.baseTime + player.currentTime;
      this.emit('currentTime', this.currentTime);
    });
    player.addEventListener('ended', () => {
      console.log('ended ', player.currentTime);
      if (player.currentTime === this.currentSource?.duration) {
        this.play(this.baseTime + this.currentSource?.duration);
      }
    });
    player.addEventListener('paused', () => {
      console.log('paused ', player.currentTime);
    });
    player.addEventListener('pause', () => {
      console.log('pause ', player.currentTime);
    });
  }

  addSource(url: string, duration?: number) {
    const source = new Source(url, duration);
    source.on('ready', () => {
      this.emit('source-ready', source.url);
      this.duration += source.duration;
    });
    // todo source off eventlisenter
    this.sources.push(source);
  }

  // todo
  removeSource() { }

  play(time?: number) {
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
    this.currentTime = <number>time;
    this.currentSource = source;
    this.player.src = source.url;
    this.player.currentTime = this.currentTime - this.baseTime;
    this.player
      .play()
      .catch(err => {
        console.error(`play error: ${err}`);
      })
  }

  pause() {
    this.player.pause();
  }
}
