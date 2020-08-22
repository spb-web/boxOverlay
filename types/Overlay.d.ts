import { Rect } from './Rect';
export declare class Overlay {
    private element;
    private disableEventsElement;
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
    /**
     * @returns {HTMLDivElement}
     */
    getElement(): HTMLDivElement;
    /**
     * @param rect
     *
     * @returns {void}
     */
    setRect(rect: Rect | null): void;
    /**
     *
     */
    mount(): void;
    /**
     *
     */
    destroy(): void;
    private applyStyle;
}
