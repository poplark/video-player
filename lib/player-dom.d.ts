export declare class PlayerComponent {
    private containerElem;
    private playerElem;
    private player;
    private playBtnElem;
    private progressBarElem;
    constructor(id: string | Element);
    initListener(): void;
    initPlayBtn(): void;
    initProgressBar(): void;
    play(time?: number): void;
    pause(): void;
    changeCurrentTime: (time: number) => void;
    renderCurrentTime: () => void;
    addSource(source: string): void;
}
