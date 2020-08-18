(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var hasChild = function (parent, el) {
        var child = parent && parent.firstChild;
        while (child) {
            if (child === el) {
                return true;
            }
            child = child.nextSibling;
        }
        return false;
    };
    var applyStyle = function (element, styles) {
        Object.entries(styles).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            element.style[key] = value;
        });
    };
    var setDefaultOverlayStyles = function (element) {
        applyStyle(element, {
            position: "fixed",
            left: '0',
            top: '0',
        });
    };

    var Overlay = /** @class */ (function () {
        function Overlay() {
            this.element = document.createElement('div');
            this.disableEventsElement = document.createElement('div');
            this.style = {
                color: 'rgba(0,0,0,.5)',
                borderRadius: 5,
                zIndex: 10000,
            };
            var _a = this, element = _a.element, disableEventsElement = _a.disableEventsElement;
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
        Object.defineProperty(Overlay.prototype, "zIndex", {
            get: function () {
                return this.style.zIndex;
            },
            set: function (zIndex) {
                var _this = this;
                this.style.zIndex = zIndex;
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
                applyStyle(this.element, {
                    transform: "translate(" + rect.x + "px, " + rect.y + "px)",
                    width: rect.width + "px",
                    height: rect.height + "px"
                });
                applyStyle(this.disableEventsElement, {
                    clipPath: 'polygon(0% 0%, 0 100%,'
                        + (rect.x + "px 100%,")
                        + (rect.x + "px " + rect.y + "px,")
                        + (rect.x + rect.width + "px " + rect.y + "px,")
                        + (rect.x + rect.width + "px " + (rect.y + rect.height) + "px,")
                        + (rect.x + "px " + (rect.y + rect.height) + "px,")
                        + (rect.x + "px 100%,")
                        + '100% 100%, 100% 0%)',
                });
            }
            else {
                this.destroy();
            }
        };
        Overlay.prototype.mount = function () {
            var _a = this, element = _a.element, disableEventsElement = _a.disableEventsElement;
            var body = document.body;
            if (!hasChild(body, element)) {
                body.appendChild(element);
            }
            if (!hasChild(body, disableEventsElement)) {
                body.appendChild(disableEventsElement);
            }
        };
        Overlay.prototype.destroy = function () {
            var _a = this, element = _a.element, disableEventsElement = _a.disableEventsElement;
            var body = document.body;
            if (hasChild(body, element)) {
                body.removeChild(element);
            }
            if (hasChild(body, disableEventsElement)) {
                body.removeChild(disableEventsElement);
            }
        };
        Overlay.prototype.applyStyle = function () {
            var _a = this, element = _a.element, style = _a.style;
            applyStyle(element, {
                boxShadow: "0 0 0 40000px " + style.color,
                borderRadius: style.borderRadius + "px",
                zIndex: "" + style.zIndex,
            });
            applyStyle(element, {
                zIndex: "" + (style.zIndex + 1),
            });
        };
        return Overlay;
    }());

    var BoxOverlay = /** @class */ (function () {
        function BoxOverlay(handleUpdate) {
            if (handleUpdate === void 0) { handleUpdate = function (rect) { }; }
            this.overlay = new Overlay();
            this.elements = [];
            this.rect = null;
            this.requestAnimationFrameId = -1;
            this.handleUpdate = handleUpdate;
        }
        BoxOverlay.prototype.add = function (selectorOrElement) {
            var _a;
            try {
                var elements = this.getElements(selectorOrElement);
                (_a = this.elements).push.apply(_a, __spread(elements));
            }
            catch (error) {
                console.error(error);
            }
        };
        BoxOverlay.prototype.remove = function (selectorOrElement) {
            if (typeof selectorOrElement === 'string') {
                this.elements = this.elements.filter(function (item) { return !item.matches(selectorOrElement); });
            }
            else {
                this.elements = this.elements.filter(function (item) { return item !== selectorOrElement; });
            }
        };
        BoxOverlay.prototype.clear = function () {
            this.elements = [];
        };
        BoxOverlay.prototype.getElements = function (selectorOrElement) {
            if (typeof selectorOrElement === 'string') {
                var findedElement = document.querySelectorAll(selectorOrElement);
                if (!findedElement) {
                    throw new Error("Can not find element by selector " + selectorOrElement);
                }
                return Array.from(findedElement);
            }
            return [selectorOrElement];
        };
        BoxOverlay.prototype.getPosition = function (element) {
            var domRect = element.getBoundingClientRect();
            return domRect;
        };
        BoxOverlay.prototype.start = function () {
            this.watch();
        };
        BoxOverlay.prototype.stop = function () {
            cancelAnimationFrame(this.requestAnimationFrameId);
            this.requestAnimationFrameId = -1;
            this.overlay.destroy();
        };
        BoxOverlay.prototype.watch = function () {
            var _this = this;
            this.calcBox();
            this.handleUpdate(this.rect);
            this.overlay.setRect(this.rect);
            this.requestAnimationFrameId = requestAnimationFrame(function () {
                _this.watch();
            });
        };
        BoxOverlay.prototype.calcBox = function () {
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
        return BoxOverlay;
    }());

    var boxOverlay = new BoxOverlay(function (rect) {
        console.log('Update rect', rect);
    });
    var selectors = [
        ['.q1'],
        ['.q2'],
        ['.q3'],
        ['.q1', '.q2'],
        []
    ];
    var prevIndex = 0;
    setInterval(function () {
        var currentIndex = prevIndex + 1 >= selectors.length ? 0 : prevIndex + 1;
        var selector = selectors[prevIndex];
        var prevSelectors = selectors[currentIndex];
        boxOverlay.clear();
        prevSelectors.forEach(function (item) {
        });
        selector.forEach(function (item) {
            boxOverlay.add(item);
        });
        prevIndex = currentIndex;
    }, 3000);
    boxOverlay.start();
    // @ts-ignore
    window.boxOverlay = boxOverlay;

}());
