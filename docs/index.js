(function () {
  'use strict';s
  let createNanoEvents = () => ({
    events: {},
    emit (event, ...args) {
      for (let i of this.events[event] || []) {
        i(...args);
      }
    },
    on (event, cb) {
  (this.events[event] = this.events[event] || []).push(cb);
      return () => (this.events[event] = this.events[event].filter(i => i !== cb))
    }
  });

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
  var isEqualDOMRect = function (firstDOMRect, secondDOMRect) { return ((firstDOMRect === null && secondDOMRect === null)
      || (firstDOMRect
          && secondDOMRect
          && (firstDOMRect.x === secondDOMRect.x
              && firstDOMRect.y === secondDOMRect.y
              && firstDOMRect.width === secondDOMRect.width
              && firstDOMRect.height === secondDOMRect.height))); };

  var disableMouseEvents = function (event) {
      event.stopPropagation();
  };
  var EVENTS_LIST = [
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
  var Overlay = /** @class */ (function () {
      // private option = {
      //   disableEvents: false,
      // }
      /**
       * @class Overlay
       */
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
              willСhange: 'transform, width, height',
          });
          setDefaultOverlayStyles(disableEventsElement);
          applyStyle(disableEventsElement, {
              right: '0',
              bottom: '0',
          });
          EVENTS_LIST.forEach(function (eventName) {
              disableEventsElement.addEventListener(eventName, disableMouseEvents, { passive: true, capture: true });
          });
          this.applyStyle();
      }
      Object.defineProperty(Overlay.prototype, "color", {
          // set disableEvents(bool:boolean) {
          //   this.option.disableEvents = bool
          // }
          // get disableEvents() {
          //   return this.option.disableEvents
          // }
          /**
           *
           */
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
          /**
           *
           */
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
          /**
           * @returns {number}
           */
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
      /**
       * @returns {HTMLDivElement}
       */
      Overlay.prototype.getElement = function () {
          return this.element;
      };
      /**
       * @param rect
       *
       * @returns {void}
       */
      Overlay.prototype.setRect = function (rect) {
          if (rect) {
              this.mount();
              applyStyle(this.element, {
                  transform: "translate(" + rect.x + "px, " + rect.y + "px)",
                  width: rect.width + "px",
                  height: rect.height + "px"
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
      };
      /**
       *
       */
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
      /**
       *
       */
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
          var style = this.style;
          applyStyle(this.element, {
              boxShadow: "0 0 0 40000px " + style.color,
              borderRadius: style.borderRadius + "px",
              zIndex: "" + style.zIndex,
          });
          applyStyle(this.disableEventsElement, {
              zIndex: "" + (style.zIndex + 1),
          });
      };
      return Overlay;
  }());

  var Rect = /** @class */ (function () {
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
      function Rect(x, y, width, height) {
          if (x === void 0) { x = 0; }
          if (y === void 0) { y = 0; }
          if (width === void 0) { width = 0; }
          if (height === void 0) { height = 0; }
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
      }
      return Rect;
  }());

  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  var updateRect = 'updateRect';
  /**
   * @class BoxOverlay
   */
  var BoxOverlay = /** @class */ (function () {
      function BoxOverlay() {
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
      BoxOverlay.prototype.add = function (selectorOrElement) {
          this.elementsOrSelectors.push(selectorOrElement);
      };
      /**
       *
       */
      BoxOverlay.prototype.clear = function () {
          this.elementsOrSelectors = [];
      };
      /**
       *
       */
      BoxOverlay.prototype.start = function () {
          this.watch();
      };
      /**
       *
       */
      BoxOverlay.prototype.stop = function () {
          cancelAnimationFrame(this.requestAnimationFrameId);
          this.requestAnimationFrameId = -1;
          this.overlay.destroy();
      };
      BoxOverlay.prototype.on = function (event, callback) {
          return this.emitter.on(event, callback);
      };
      BoxOverlay.prototype.getElements = function () {
          return this.elementsOrSelectors.reduce(function (elements, selectorOrElement) {
              if (typeof selectorOrElement === 'string') {
                  var findedElement = document.querySelectorAll(selectorOrElement);
                  if (!findedElement) {
                      throw new Error("Can not find element by selector " + selectorOrElement);
                  }
                  return elements.concat(Array.from(findedElement));
              }
              return elements.concat([selectorOrElement]);
          }, []);
      };
      BoxOverlay.prototype.getPosition = function (element) {
          var domRect = element.getBoundingClientRect();
          return new Rect(domRect.left, domRect.top, domRect.width, domRect.height);
      };
      BoxOverlay.prototype.watch = function () {
          var _this = this;
          var rect = this.calcBox();
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
              this.overlay.setRect(this.rect);
              this.emitter.emit(BoxOverlay.updateRect, this.rect);
          }
          this.requestAnimationFrameId = requestAnimationFrame(function () {
              _this.watch();
          });
      };
      BoxOverlay.prototype.calcBox = function () {
          var elements = this.getElements();
          if (elements.length === 0) {
              return null;
          }
          var x = MAX_SAFE_INTEGER;
          var y = MAX_SAFE_INTEGER;
          var width = 0;
          var height = 0;
          var bottom = 0;
          var right = 0;
          elements.map(this.getPosition).forEach(function (elRect) {
              x = Math.min(elRect.x, x);
              y = Math.min(elRect.y, y);
              right = Math.max(elRect.x + elRect.width, right);
              bottom = Math.max(elRect.y + elRect.height, bottom);
          });
          width = right - x;
          height = bottom - y;
          return { x: x, y: y, width: width, height: height };
      };
      BoxOverlay.updateRect = updateRect;
      return BoxOverlay;
  }());

  //@ts-ignore
  core.registerLanguage('typescript', typescript_1);
  core.initHighlightingOnLoad();
  // @ts-ignore
  window.BoxOverlay = BoxOverlay;
  var boxOverlay = new BoxOverlay();
  boxOverlay.on('updateRect', function (rect) {
      console.log('Update rect', rect);
  });
  var selectors = [
      ['.example-element1'],
      ['.example-element2'],
      ['.example-element3'],
      ['.example-element1', '.example-element2'],
  ];
  var prevIndex = 0;
  var interval;
  var run = false;
  // @ts-ignore
  window.stopExample = function stopExample() {
      if (!run) {
          return;
      }
      var stopButton = document.querySelector('.stop-example');
      if (stopButton) {
          stopButton.style.display = 'none';
      }
      if (interval) {
          clearInterval(interval);
      }
      boxOverlay.clear();
      boxOverlay.stop();
      run = false;
  };
  function step() {
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
  }
  // @ts-ignore
  window.startExample = function startExample() {
      if (run) {
          return;
      }
      step();
      var stopButton = document.querySelector('.stop-example');
      if (stopButton) {
          stopButton.style.display = 'block';
      }
      run = true;
      interval = setInterval(function () {
          step();
      }, 3000);
      boxOverlay.start();
  };
  // @ts-ignore
  window.boxOverlay = boxOverlay;

}());
