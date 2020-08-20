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
const setDefaultOverlayStyles = (element) => {
    applyStyle(element, {
        position: `fixed`,
        left: '0',
        top: '0',
    });
};
const isEqualDOMRect = (firstDOMRect, secondDOMRect) => ((firstDOMRect === null && secondDOMRect === null)
    || (firstDOMRect
        && secondDOMRect
        && (firstDOMRect.x === secondDOMRect.x
            && firstDOMRect.y === secondDOMRect.y
            && firstDOMRect.width === secondDOMRect.width
            && firstDOMRect.height === secondDOMRect.height)));

const disableMouseEvents = (event) => {
    event.stopPropagation();
};
const EVENTS_LIST = [
    'click',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'touchcancel',
    'touchend',
    'touchmove',
    'touchstart',
];
class Overlay {
    // private option = {
    //   disableEvents: false,
    // }
    constructor() {
        this.element = document.createElement('div');
        this.disableEventsElement = document.createElement('div');
        this.style = {
            color: 'rgba(0,0,0,.5)',
            borderRadius: 5,
            zIndex: 10000,
        };
        const { element, disableEventsElement } = this;
        setDefaultOverlayStyles(element);
        applyStyle(element, {
            pointerEvents: 'none',
            willСhange: 'transform, width, height',
        });
        setDefaultOverlayStyles(disableEventsElement);
        applyStyle(disableEventsElement, {
            right: '0',
            bottom: '0',
        });
        EVENTS_LIST.forEach(eventName => {
            disableEventsElement.addEventListener(eventName, disableMouseEvents, { passive: true, capture: true });
        });
        this.applyStyle();
    }
    // set disableEvents(bool:boolean) {
    //   this.option.disableEvents = bool
    // }
    // get disableEvents() {
    //   return this.option.disableEvents
    // }
    set color(color) {
        this.style.color = color;
        requestAnimationFrame(() => {
            this.applyStyle();
        });
    }
    get color() {
        return this.style.color;
    }
    get borderRadius() {
        return this.style.borderRadius;
    }
    set borderRadius(radius) {
        this.style.borderRadius = radius;
        requestAnimationFrame(() => {
            this.applyStyle();
        });
    }
    get zIndex() {
        return this.style.zIndex;
    }
    set zIndex(zIndex) {
        this.style.zIndex = zIndex;
        requestAnimationFrame(() => {
            this.applyStyle();
        });
    }
    getElement() {
        return this.element;
    }
    setRect(rect) {
        if (rect) {
            this.mount();
            applyStyle(this.element, {
                transform: `translate(${rect.x}px, ${rect.y}px)`,
                width: `${rect.width}px`,
                height: `${rect.height}px`
            });
            // const clipPath = this.disableEvents 
            //   ? 'none'
            //   : 'polygon(0% 0%, 0 100%,'
            //     + `${rect.x}px 100%,`
            //     + `${rect.x}px ${rect.y}px,`
            //     + `${rect.x + rect.width}px ${rect.y}px,`
            //     + `${rect.x + rect.width}px ${rect.y + rect.height}px,`
            //     + `${rect.x}px ${rect.y + rect.height}px,`
            //     + `${rect.x}px 100%,`
            //     + '100% 100%, 100% 0%)'
            // applyStyle(
            //   this.disableEventsElement, 
            //   { clipPath: clipPath, },
            // )
        }
        else {
            this.destroy();
        }
    }
    mount() {
        const { element, disableEventsElement } = this;
        const { body } = document;
        if (!hasChild(body, element)) {
            body.appendChild(element);
        }
        if (!hasChild(body, disableEventsElement)) {
            body.appendChild(disableEventsElement);
        }
    }
    destroy() {
        const { element, disableEventsElement } = this;
        const { body } = document;
        if (hasChild(body, element)) {
            body.removeChild(element);
        }
        if (hasChild(body, disableEventsElement)) {
            body.removeChild(disableEventsElement);
        }
    }
    applyStyle() {
        const { style } = this;
        applyStyle(this.element, {
            boxShadow: `0 0 0 40000px ${style.color}`,
            borderRadius: `${style.borderRadius}px`,
            zIndex: `${style.zIndex}`,
        });
        applyStyle(this.disableEventsElement, {
            zIndex: `${style.zIndex + 1}`,
        });
    }
}

const { MAX_SAFE_INTEGER } = Number;
class BoxOverlay {
    constructor(handleUpdate = (rect) => { }) {
        this.overlay = new Overlay();
        this.elementsOrSelectors = [];
        this.rect = null;
        this.requestAnimationFrameId = -1;
        this.handleUpdate = handleUpdate;
    }
    add(selectorOrElement) {
        this.elementsOrSelectors.push(selectorOrElement);
    }
    clear() {
        this.elementsOrSelectors = [];
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
        return domRect;
    }
    start() {
        this.watch();
    }
    stop() {
        cancelAnimationFrame(this.requestAnimationFrameId);
        this.requestAnimationFrameId = -1;
        this.overlay.destroy();
    }
    watch() {
        const rect = this.calcBox();
        if (!isEqualDOMRect(this.rect, rect)) {
            if (!rect) {
                this.rect = rect;
            }
            else {
                if (!this.rect) {
                    this.rect = new DOMRect(rect.x, rect.y, rect.width, rect.height);
                }
                else {
                    this.rect.x = rect.x;
                    this.rect.y = rect.y;
                    this.rect.width = rect.width;
                    this.rect.height = rect.height;
                }
            }
            this.overlay.setRect(this.rect);
            this.handleUpdate(this.rect);
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

export { BoxOverlay };
