export declare class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    /**
     * @param {number=} x
     * @param {number=} y
     * @param {number=} width
     * @param {number=} height
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     */
    constructor(x?: number, y?: number, width?: number, height?: number);
    /**
     * @property {number} top
     */
    get top(): number;
    /**
     * @property {number} bottom
     */
    get bottom(): number;
    /**
     * @property {number} left
     */
    get left(): number;
    /**
     * @property {number} right
     */
    get right(): number;
}
