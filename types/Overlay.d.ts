import { Rect } from './Rect';
export declare class Overlay {
    private readonly canvas;
    private readonly resizeObserver;
    private readonly ctx;
    private readonly disableEventsElement;
    private requestAnimationFrameId;
    private readonly data;
    private readonly style;
    /**
     * @class Overlay
     */
    constructor();
    /**
     *
     */
    get color(): string;
    set color(color: string);
    /**
     *
     */
    get borderRadius(): number;
    set borderRadius(radius: number);
    /**
     * @returns {number}
     */
    get zIndex(): number;
    set zIndex(zIndex: number);
    set disableMouseEvents(isDisable: boolean);
    get disableMouseEvents(): boolean;
    set rect(rect: Rect);
    get rect(): Rect;
    /**
     * @returns {HTMLCanvasElement}
     */
    getCanvas(): HTMLCanvasElement;
    /**
     *
     */
    mount(): void;
    /**
     *
     */
    destroy(): void;
    private applyCanvasStyle;
    private draw;
    private handleResize;
    private updateRect;
}
