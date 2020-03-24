/// <reference types="node" />
import { EventEmitter } from 'events';
import { Source } from './source';
export declare enum PlayerState {
    playing = 0,
    paused = 1
}
export declare class Player extends EventEmitter {
    private playerElem;
    private sources;
    private baseTime;
    private _currentTime;
    private currentSource?;
    get currentTime(): number;
    private _duration;
    get duration(): number;
    set duration(time: number);
    private _state;
    get state(): PlayerState;
    constructor(player: HTMLMediaElement);
    onPlay: () => void;
    onPause: () => void;
    onTimeUpdate: () => void;
    onEnded: () => void;
    load(): void;
    unload(): void;
    addSource(uri: string): void;
    removeSource(): void;
    playSource(source: Source): void;
    play(time?: number): Promise<any>;
    pause(): void;
}
