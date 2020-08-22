import { Overlay } from './Overlay';
import { Rect } from './Rect';
export declare class BoxOverlay {
    /**
     * @public
     * @readonly
     * @property {Overlay} overlay
     */
    readonly overlay: Overlay;
    /**
     * @class BoxOverlay
     *
     * @param handleUpdate {Function=}
     */
    constructor(handleUpdate?: (rect: Rect | null) => void);
    private handleUpdate;
    private elementsOrSelectors;
    private rect;
    private requestAnimationFrameId;
    /**
     *
     * @param selectorOrElement {Element|string}
     */
    add(selectorOrElement: Element | string): void;
    /**
     *
     */
    clear(): void;
    /**
     *
     */
    start(): void;
    /**
     *
     */
    stop(): void;
    private getElements;
    private getPosition;
    private watch;
    private calcBox;
}
