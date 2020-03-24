/// <reference types="node" />
import { EventEmitter } from 'events';
declare enum SourceState {
    init = 0,
    loading = 1,
    ready = 2
}
export declare class Source extends EventEmitter {
    videoElem: HTMLVideoElement;
    state: SourceState;
    uri: string;
    _duration: number;
    get duration(): number;
    set duration(sec: number);
    constructor(uri: string);
    private init;
}
export {};
