function hasChild(parent, el) {
    var child = parent && parent.firstChild;
    while (child) {
        if (child === el) {
            return true;
        }
        child = child.nextSibling;
    }
    return false;
}

class Overlay {
    constructor() {
        this.element = document.createElement('div');
        this.style = {
            color: 'rgba(0,0,0,.5)',
            borderRadius: 5,
            zIndex: 10000,
        };
        this.element.style.position = 'fixed';
        this.element.style.left = '0';
        this.element.style.top = '0';
        this.element.style.pointerEvents = 'none';
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
    getElement() {
        return this.element;
    }
    setRect(rect) {
        if (rect) {
            this.mount();
            this.element.style.transform = `translate(${rect.x}px, ${rect.y}px)`;
            this.element.style.width = `${rect.width}px`;
            this.element.style.height = `${rect.height}px`;
        }
        else {
            this.destroy();
        }
    }
    mount() {
        if (!hasChild(document.body, this.element)) {
            document.body.appendChild(this.element);
        }
    }
    destroy() {
        if (hasChild(document.body, this.element)) {
            document.body.removeChild(this.element);
        }
    }
    applyStyle() {
        this.element.style.setProperty('box-shadow', `0 0 0 20000px ${this.style.color}`);
        this.element.style.setProperty('border-radius', `${this.style.borderRadius}px`);
        this.element.style.setProperty('z-index', `${this.style.zIndex}`);
    }
}

class BoxOverlay {
    constructor(handleUpdate = (rect) => { }) {
        this.overlay = new Overlay();
        this.elements = [];
        this.rect = null;
        this.requestAnimationFrameId = -1;
        this.handleUpdate = handleUpdate;
    }
    add(selectorOrElement) {
        try {
            const elements = this.getElements(selectorOrElement);
            this.elements.push(...elements);
        }
        catch (error) {
            console.error(error);
        }
    }
    remove(selectorOrElement) {
        if (typeof selectorOrElement === 'string') {
            this.elements = this.elements.filter(item => !item.matches(selectorOrElement));
        }
        else {
            this.elements = this.elements.filter(item => item !== selectorOrElement);
        }
    }
    clear() {
        this.elements = [];
    }
    getElements(selectorOrElement) {
        if (typeof selectorOrElement === 'string') {
            const findedElement = document.querySelectorAll(selectorOrElement);
            if (!findedElement) {
                throw new Error(`Can not find element by selector ${selectorOrElement}`);
            }
            return Array.from(findedElement);
        }
        return [selectorOrElement];
    }
    getPosition(element) {
        const domRect = element.getBoundingClientRect();
        return domRect;
    }
    calcBox() {
        if (this.elements.length === 0) {
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
        this.elements.map(this.getPosition).forEach((elRect) => {
            boxRect.x = Math.min(elRect.x, boxRect.x);
            boxRect.y = Math.min(elRect.y, boxRect.y);
            right = Math.max(elRect.x + elRect.width, right);
            bottom = Math.max(elRect.y + elRect.height, bottom);
        });
        boxRect.width = right - boxRect.x;
        boxRect.height = bottom - boxRect.y;
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
}

export { BoxOverlay };
