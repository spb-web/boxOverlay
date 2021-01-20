import { createNanoEvents } from 'nanoevents';

const hasChild = (parent, el) => {
    var child = parent && parent.firstChild;
    while (child) {
        if (child === el) {
            return true;
        }
        child = child.nextSibling;
    }
    return false;
};
const applyStyle = (element, styles) => {
    Object.entries(styles).forEach(([key, value]) => {
        element.style[key] = value;
    });
};
const isEqualDOMRect = (firstDOMRect, secondDOMRect) => ((firstDOMRect === null && secondDOMRect === null)
    || (firstDOMRect
        && secondDOMRect
        && (firstDOMRect.x === secondDOMRect.x
            && firstDOMRect.y === secondDOMRect.y
            && firstDOMRect.width === secondDOMRect.width
            && firstDOMRect.height === secondDOMRect.height)));

class Rect {
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
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * @property {number} top
     */
    get top() {
        return this.y + Math.min(0, this.height);
    }
    /**
     * @property {number} bottom
     */
    get bottom() {
        return this.y + Math.max(0, this.height);
    }
    /**
     * @property {number} left
     */
    get left() {
        return this.x + Math.min(0, this.width);
    }
    /**
     * @property {number} right
     */
    get right() {
        return this.x + Math.max(0, this.width);
    }
}

class Overlay {
    /**
     * @class Overlay
     */
    constructor() {
        this.canvas = document.createElement('canvas');
        this.resizeObserver = new ResizeObserver((entries) => this.handleResize(entries));
        this.disableEventsElement = document.createElement('div');
        this.requestAnimationFrameId = null;
        this.data = {
            disableMouseEvents: true,
            rect: new Rect(),
        };
        this.style = {
            color: 'rgba(0,0,0,.5)',
            borderRadius: 5,
            zIndex: 10000,
        };
        const { canvas } = this;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error();
        }
        this.ctx = ctx;
        this.resizeObserver.observe(canvas);
        this.applyCanvasStyle();
    }
    /**
     *
     */
    get color() {
        return this.style.color;
    }
    set color(color) {
        this.style.color = color;
        this.draw();
    }
    /**
     *
     */
    get borderRadius() {
        return this.style.borderRadius;
    }
    set borderRadius(radius) {
        this.style.borderRadius = radius;
        this.draw();
    }
    /**
     * @returns {number}
     */
    get zIndex() {
        return this.style.zIndex;
    }
    set zIndex(zIndex) {
        this.style.zIndex = zIndex;
        requestAnimationFrame(() => {
            this.applyCanvasStyle();
        });
    }
    set disableMouseEvents(isDisable) {
        this.data.disableMouseEvents = isDisable;
        if (this.rect) {
            this.updateRect(this.rect);
        }
    }
    get disableMouseEvents() {
        return this.data.disableMouseEvents;
    }
    set rect(rect) {
        this.data.rect = rect;
        if (rect) {
            this.updateRect(rect);
        }
        else {
            this.destroy();
        }
    }
    get rect() {
        return this.data.rect;
    }
    /**
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas;
    }
    /**
     *
     */
    mount() {
        const { canvas, disableEventsElement } = this;
        const { body } = document;
        if (!hasChild(body, canvas)) {
            body.appendChild(canvas);
        }
        if (!hasChild(body, disableEventsElement)) {
            body.appendChild(disableEventsElement);
        }
    }
    /**
     *
     */
    destroy() {
        const { canvas, disableEventsElement } = this;
        const { body } = document;
        if (hasChild(body, canvas)) {
            body.removeChild(canvas);
        }
        if (hasChild(body, disableEventsElement)) {
            body.removeChild(disableEventsElement);
        }
    }
    applyCanvasStyle() {
        const { canvas, disableEventsElement } = this;
        applyStyle(canvas, {
            zIndex: this.style.zIndex.toString(10),
            pointerEvents: 'none',
            position: 'fixed',
            width: '100%',
            height: '100%',
            left: '0',
            top: '0',
        });
        applyStyle(disableEventsElement, {
            position: 'fixed',
            left: '0',
            top: '0',
            bottom: '0',
            right: '0',
        });
    }
    draw() {
        const { requestAnimationFrameId, ctx, canvas: { width: canvasWidth, height: canvasHeight } } = this;
        if (requestAnimationFrameId) {
            cancelAnimationFrame(requestAnimationFrameId);
        }
        this.requestAnimationFrameId = requestAnimationFrame(() => {
            const { devicePixelRatio } = window;
            // Background
            ctx.globalCompositeOperation = 'copy';
            ctx.fillStyle = this.style.color;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            // Window
            ctx.globalCompositeOperation = 'destination-out';
            const x = this.data.rect.x * devicePixelRatio;
            const y = this.data.rect.y * devicePixelRatio;
            const width = this.data.rect.width * devicePixelRatio;
            const height = this.data.rect.height * devicePixelRatio;
            const radius = this.style.borderRadius * devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fillStyle = '#000';
            ctx.fill();
        });
    }
    handleResize([{ contentRect: { width, height } }]) {
        const { canvas } = this;
        const { devicePixelRatio } = window;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        this.draw();
    }
    updateRect(rect) {
        this.mount();
        this.draw();
        const disableEventsElementStyle = {
            clipPath: 'none',
            willСhange: 'none',
        };
        if (!this.disableMouseEvents) {
            disableEventsElementStyle.clipPath = 'polygon(0% 0%, 0 100%,'
                + `${rect.x}px 100%,`
                + `${rect.x}px ${rect.y}px,`
                + `${rect.x + rect.width}px ${rect.y}px,`
                + `${rect.x + rect.width}px ${rect.y + rect.height}px,`
                + `${rect.x}px ${rect.y + rect.height}px,`
                + `${rect.x}px 100%,`
                + '100% 100%, 100% 0%)';
            disableEventsElementStyle.willСhange = 'clip-path';
        }
        applyStyle(this.disableEventsElement, disableEventsElementStyle);
    }
}

const { MAX_SAFE_INTEGER } = Number;
const updateRect = 'updateRect';
/**
 * @class BoxOverlay
 * @example ```
 * const boxOverlay = new BoxOverlay()
 *
 * boxOverlay.on('updateRect', (rect) => {
 *   console.log('Update rect', rect)
 * })
 *
 * boxOverlay.add(ELEMENT_TO_BE_HIGHLIGHTED)
 * boxOverlay.start()
 *
 * setTimeout(() => {
 *   boxOverlay.stop()
 * }, 5000)
 * ```
 */
class BoxOverlay {
    constructor() {
        /**
         * @public
         * @readonly
         * @property {Overlay} overlay
         */
        this.overlay = new Overlay();
        this.emitter = createNanoEvents();
        this.elementsOrSelectors = [];
        this.rect = null;
        this.requestAnimationFrameId = -1;
    }
    /**
     *
     * @param selectorOrElement {Element|string}
     */
    add(selectorOrElement) {
        this.elementsOrSelectors.push(selectorOrElement);
    }
    /**
     *
     */
    clear() {
        this.elementsOrSelectors = [];
    }
    /**
     *
     */
    start() {
        this.watch();
    }
    /**
     *
     */
    stop() {
        cancelAnimationFrame(this.requestAnimationFrameId);
        this.requestAnimationFrameId = -1;
        this.overlay.destroy();
    }
    on(event, callback) {
        return this.emitter.on(event, callback);
    }
    getElements() {
        return this.elementsOrSelectors.reduce((elements, selectorOrElement) => {
            if (typeof selectorOrElement === 'string') {
                const findedElement = document.querySelectorAll(selectorOrElement);
                if (!findedElement) {
                    throw new Error(`Can not find element by selector ${selectorOrElement}`);
                }
                return elements.concat(Array.from(findedElement));
            }
            return elements.concat([selectorOrElement]);
        }, []);
    }
    getPosition(element) {
        const domRect = element.getBoundingClientRect();
        return new Rect(domRect.left, domRect.top, domRect.width, domRect.height);
    }
    watch() {
        const rect = this.calcBox();
        if (!isEqualDOMRect(this.rect, rect)) {
            if (!rect) {
                this.rect = rect;
            }
            else {
                if (!this.rect) {
                    this.rect = new Rect(rect.x, rect.y, rect.width, rect.height);
                }
                else {
                    this.rect.x = rect.x;
                    this.rect.y = rect.y;
                    this.rect.width = rect.width;
                    this.rect.height = rect.height;
                }
            }
            this.overlay.rect = this.rect ? this.rect : new Rect();
            /**
             * Called when the position or size of the highlight area has
             * changed
             *
             * @event BoxOverlay#updateRect
             * @type {Rect|null}
             */
            this.emitter.emit(BoxOverlay.updateRect, this.rect);
        }
        this.requestAnimationFrameId = requestAnimationFrame(() => {
            this.watch();
        });
    }
    calcBox() {
        const elements = this.getElements();
        if (elements.length === 0) {
            return null;
        }
        let x = MAX_SAFE_INTEGER;
        let y = MAX_SAFE_INTEGER;
        let width = 0;
        let height = 0;
        let bottom = 0;
        let right = 0;
        elements.map(this.getPosition).forEach((elRect) => {
            x = Math.min(elRect.x, x);
            y = Math.min(elRect.y, y);
            right = Math.max(elRect.x + elRect.width, right);
            bottom = Math.max(elRect.y + elRect.height, bottom);
        });
        width = right - x;
        height = bottom - y;
        return { x, y, width, height };
    }
}
BoxOverlay.updateRect = updateRect;

export { BoxOverlay, Overlay, Rect };
