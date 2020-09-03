import MicroEmitter from 'micro-emitter';
import { Overlay } from './Overlay';
/**
 * @class BoxOverlay
 */
export declare class BoxOverlay extends MicroEmitter {
    /**
     * @public
     * @readonly
     * @property {Overlay} overlay
     */
    readonly overlay: Overlay;
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
    static updateRect: string;
}
