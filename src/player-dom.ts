import { Player, PlayerState } from './player';
import { isNumber, isString, normalizeId } from './common/utils';

export class PlayerComponent {
  private containerElem: Element
  private playerElem: HTMLMediaElement
  private player: Player

  private playBtnElem: HTMLElement = document.createElement('div')
  private progressBarElem: HTMLElement = document.createElement('div')
  
  constructor(id: string|Element) {
    if (isString(id)) {
      const container = document.querySelector('#' + normalizeId(<string>id));
      if (container) {
        this.containerElem = container;
      } else {
        let err = new Error(`not found element by id ${id}`);
        err.name = 'NotFound';
        throw err;
      }
    } else if (id instanceof Element) {
      this.containerElem = id;
    } else {
      throw new TypeError(`The element or ID supplied is not valid`);
    }
    this.playerElem = document.createElement('video');
    this.playerElem.preload = 'auto';
    this.playerElem.id = `m-player-${normalizeId(<string>id)}`;
    this.containerElem.appendChild(this.playerElem);
    this.player = new Player(this.playerElem);
    this.initPlayBtn();
    this.initProgressBar();
    this.initListener();
  }

  initListener() {
    this.player.on('play', (source) => {
      console.log(`play `, source);
      this.playBtnElem.innerText = 'pause';
    });
    this.player.on('currentTime', (currentTime) => {
      console.log(`currentTime ${currentTime}`);
      this.progressBarElem.innerText = `${this.player.currentTime}/${this.player.duration}`;
    });
    this.player.on('duration-changed', (duration) => {
      console.log(`duration ${duration}`);
      this.progressBarElem.innerText = `${this.player.currentTime}/${this.player.duration}`;
    });
    this.player.on('pause', (source) => {
      console.log(`pause `, source);
      this.playBtnElem.innerText = 'play';
    });
  }

  initPlayBtn() {
    let btn = document.createElement('div');
    btn.innerText = 'play';
    btn.addEventListener('click', () => {
      switch (this.player.state) {
        case PlayerState.playing:
          this.pause();
          break;
        case PlayerState.paused:
          this.play(this.player.currentTime);
          break;
        default:
      }
    });
    this.playBtnElem = btn;
    this.containerElem.appendChild(this.playBtnElem);
  }

  initProgressBar() {
    let bar = document.createElement('div');
    bar.innerText = `${this.player.currentTime}/${this.player.duration}`;
    this.progressBarElem = bar;
    this.containerElem.appendChild(this.progressBarElem);
  }

  play(time?: number) {
    this.player
      .play(time)
      .catch(err => {
        alert(`play error ${err}`);
      })
  }

  pause() {
    this.player.pause();
  }

  changeCurrentTime = (time: number) => {
    if (isNumber(time) && time >= 0) {
      this.player.play(time);
    } else {
      throw new TypeError(`The time supplied is not valid`);
    }
  }

  renderCurrentTime = () => {
  }

  addSource(source: string) {
    this.player.addSource(source);
  }
}