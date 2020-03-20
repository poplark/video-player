/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class MultiplePlayer extends EventEmitter {
    private player;
    private sources;
    private baseTime;
    private currentTime;
    private currentSource?;
    private _duration;
    get duration(): number;
    set duration(time: number);
    constructor(player: HTMLMediaElement);
    addSource(url: string, duration?: number): void;
    removeSource(): void;
    play(time?: number): void;
    pause(): void;
}
