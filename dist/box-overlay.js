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

var Overlay = /** @class */ (function () {
    function Overlay() {
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
    Object.defineProperty(Overlay.prototype, "color", {
        get: function () {
            return this.style.color;
        },
        set: function (color) {
            var _this = this;
            this.style.color = color;
            requestAnimationFrame(function () {
                _this.applyStyle();
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Overlay.prototype, "borderRadius", {
        get: function () {
            return this.style.borderRadius;
        },
        set: function (radius) {
            var _this = this;
            this.style.borderRadius = radius;
            requestAnimationFrame(function () {
                _this.applyStyle();
            });
        },
        enumerable: false,
        configurable: true
    });
    Overlay.prototype.getElement = function () {
        return this.element;
    };
    Overlay.prototype.setRect = function (rect) {
        if (rect) {
            this.mount();
            this.element.style.transform = "translate(" + rect.x + "px, " + rect.y + "px)";
            this.element.style.width = rect.width + "px";
            this.element.style.height = rect.height + "px";
        }
        else {
            this.destroy();
        }
    };
    Overlay.prototype.mount = function () {
        if (!hasChild(document.body, this.element)) {
            document.body.appendChild(this.element);
        }
    };
    Overlay.prototype.destroy = function () {
        if (hasChild(document.body, this.element)) {
            document.body.removeChild(this.element);
        }
    };
    Overlay.prototype.applyStyle = function () {
        this.element.style.setProperty('box-shadow', "0 0 0 20000px " + this.style.color);
        this.element.style.setProperty('border-radius', this.style.borderRadius + "px");
        this.element.style.setProperty('z-index', "" + this.style.zIndex);
    };
    return Overlay;
}());

var OverlayBox = /** @class */ (function () {
    function OverlayBox(handleUpdate) {
        if (handleUpdate === void 0) { handleUpdate = function (rect) { }; }
        this.overlay = new Overlay();
        this.elements = [];
        this.rect = null;
        this.requestAnimationFrameId = -1;
        this.handleUpdate = handleUpdate;
    }
    OverlayBox.prototype.add = function (selectorOrElement) {
        var _a;
        try {
            var elements = this.getElements(selectorOrElement);
            (_a = this.elements).push.apply(_a, elements);
        }
        catch (error) {
            console.error(error);
        }
    };
    OverlayBox.prototype.remove = function (selectorOrElement) {
        if (typeof selectorOrElement === 'string') {
            this.elements = this.elements.filter(function (item) { return !item.matches(selectorOrElement); });
        }
        else {
            this.elements = this.elements.filter(function (item) { return item !== selectorOrElement; });
        }
    };
    OverlayBox.prototype.clear = function () {
        this.elements = [];
    };
    OverlayBox.prototype.getElements = function (selectorOrElement) {
        if (typeof selectorOrElement === 'string') {
            var findedElement = document.querySelectorAll(selectorOrElement);
            if (!findedElement) {
                throw new Error("Can not find element by selector " + selectorOrElement);
            }
            return findedElement;
        }
        return [selectorOrElement];
    };
    OverlayBox.prototype.getPosition = function (element) {
        var domRect = element.getBoundingClientRect();
        return domRect;
    };
    OverlayBox.prototype.calcBox = function () {
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
        var boxRect = this.rect;
        var bottom = 0;
        var right = 0;
        this.elements.map(this.getPosition).forEach(function (elRect) {
            boxRect.x = Math.min(elRect.x, boxRect.x);
            boxRect.y = Math.min(elRect.y, boxRect.y);
            right = Math.max(elRect.x + elRect.width, right);
            bottom = Math.max(elRect.y + elRect.height, bottom);
        });
        boxRect.width = right - boxRect.x;
        boxRect.height = bottom - boxRect.y;
    };
    OverlayBox.prototype.start = function () {
        this.watch();
    };
    OverlayBox.prototype.stop = function () {
        cancelAnimationFrame(this.requestAnimationFrameId);
        this.requestAnimationFrameId = -1;
        this.overlay.destroy();
    };
    OverlayBox.prototype.watch = function () {
        var _this = this;
        this.calcBox();
        this.handleUpdate(this.rect);
        this.overlay.setRect(this.rect);
        this.requestAnimationFrameId = requestAnimationFrame(function () {
            _this.watch();
        });
    };
    return OverlayBox;
}());

export { OverlayBox };
