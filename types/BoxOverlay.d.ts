import { Overlay } from './Overlay';
import { Rect } from './Rect';
declare const updateRect = "updateRect";
interface Events {
    [updateRect]: (rect: Rect | null) => void;
}
/**
 * @class BoxOverlay
 * @example ```
 * const boxOverlay = new BoxOverlay()
 *
 * boxOverlay.on('updateRect', (rect) => {
 *   console.log('Update rect', rect)
 * })
 *
 * boxOverlay.add(ELEMENT_TO_BE_SELECTED)
 * boxOverlay.start()
 *
 * setTimeout(() => {
 *   boxOverlay.stop()
 * }, 5000)
 * ```
 */
export declare class BoxOverlay {
    /**
     * @public
     * @readonly
     * @property {Overlay} overlay
     */
    readonly overlay: Overlay;
    private emitter;
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
    on<E extends keyof Events>(event: E, callback: Events[E]): import("nanoevents").Unsubscribe;
    private getElements;
    private getPosition;
    private watch;
    private calcBox;
    static updateRect: string;
}
export {};
