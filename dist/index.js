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

class Overlay {
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
        });
        setDefaultOverlayStyles(disableEventsElement);
        applyStyle(disableEventsElement, {
            right: '0',
            bottom: '0',
        });
        this.applyStyle();
    }
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
            applyStyle(this.disableEventsElement, {
                clipPath: 'polygon(0% 0%, 0 100%,'
                    + `${rect.x}px 100%,`
                    + `${rect.x}px ${rect.y}px,`
                    + `${rect.x + rect.width}px ${rect.y}px,`
                    + `${rect.x + rect.width}px ${rect.y + rect.height}px,`
                    + `${rect.x}px ${rect.y + rect.height}px,`
                    + `${rect.x}px 100%,`
                    + '100% 100%, 100% 0%)',
            });
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
        const { element, style } = this;
        applyStyle(element, {
            boxShadow: `0 0 0 40000px ${style.color}`,
            borderRadius: `${style.borderRadius}px`,
            zIndex: `${style.zIndex}`,
        });
        applyStyle(element, {
            zIndex: `${style.zIndex + 1}`,
        });
    }
}

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
        this.calcBox();
        this.handleUpdate(this.rect);
        this.overlay.setRect(this.rect);
        this.requestAnimationFrameId = requestAnimationFrame(() => {
            this.watch();
        });
    }
    calcBox() {
        const elements = this.getElements();
        if (elements.length === 0) {
            this.rect = null;
            return;
        }
        if (this.rect === null) {
            this.rect = new DOMRect(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 0, 0);
        }
        else {
            this.rect.x = Number.MAX_SAFE_INTEGER;
            this.rect.y = Number.MAX_SAFE_INTEGER;
            this.rect.width = 0;
            this.rect.height = 0;
        }
        const boxRect = this.rect;
        let bottom = 0;
        let right = 0;
        elements.map(this.getPosition).forEach((elRect) => {
            boxRect.x = Math.min(elRect.x, boxRect.x);
            boxRect.y = Math.min(elRect.y, boxRect.y);
            right = Math.max(elRect.x + elRect.width, right);
            bottom = Math.max(elRect.y + elRect.height, bottom);
        });
        boxRect.width = right - boxRect.x;
        boxRect.height = bottom - boxRect.y;
    }
}

export { BoxOverlay };
