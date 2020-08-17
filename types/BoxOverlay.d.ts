import { Overlay } from './Overlay';
export declare class BoxOverlay {
    overlay: Overlay;
    constructor(handleUpdate?: (rect: DOMRect | null) => void);
    private handleUpdate;
    private elements;
    private rect;
    private requestAnimationFrameId;
    add(selectorOrElement: Element | string): void;
    remove(selectorOrElement: Element | string): void;
    clear(): void;
    private getElements;
    private getPosition;
    private calcBox;
    start(): void;
    stop(): void;
    private watch;
}
