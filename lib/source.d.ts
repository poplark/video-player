/// <reference types="node" />
import { EventEmitter } from 'events';
declare enum SourceState {
    init = 0,
    loading = 1,
    ready = 2
}
export declare class Source extends EventEmitter {
    state: SourceState;
    url: string;
    _duration: number;
    get duration(): number;
    set duration(sec: number);
    private loadMeta;
    constructor(url: string, duration?: number);
}
export {};
