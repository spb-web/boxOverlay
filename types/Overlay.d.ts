import { Rect } from './Rect';
export declare class Overlay {
    private element;
    private disableEventsElement;
    private data;
    /**
     * @class Overlay
     */
    constructor();
    private style;
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
    set rect(rect: Rect | null);
    get rect(): Rect | null;
    /**
     * @returns {HTMLDivElement}
     */
    getElement(): HTMLDivElement;
    /**
     *
     */
    mount(): void;
    /**
     *
     */
    destroy(): void;
    private updateRect;
    private applyStyle;
}
