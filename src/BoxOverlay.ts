import { createNanoEvents, Emitter } from 'nanoevents'
import { Overlay } from './Overlay'
import { isEqualDOMRect } from './utils'
import { Rect } from './Rect'

const { MAX_SAFE_INTEGER } = Number
const updateRect = 'updateRect'

interface Events {
  [updateRect]: (rect: Rect|null) => void
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
 * boxOverlay.add(ELEMENT_TO_BE_HIGHLIGHTED)
 * boxOverlay.start()
 * 
 * setTimeout(() => {
 *   boxOverlay.stop()
 * }, 5000)
 * ```
 */
export class BoxOverlay {
  /**
   * @public
   * @readonly
   * @property {Overlay} overlay
   */
  public readonly overlay = new Overlay()

  private emitter:Emitter = createNanoEvents()

  private elementsOrSelectors:(Element|string)[] = []

  private rect:Rect|null = null

  private requestAnimationFrameId:number = -1

  /**
   * 
   * @param selectorOrElement {Element|string}
   */
  public add(selectorOrElement:Element|string) {
    this.elementsOrSelectors.push(selectorOrElement)
  }

  /**
   * 
   */
  public clear() {
    this.elementsOrSelectors = []
  }

  /**
   * 
   */
  public start() {
    this.watch()
  }

  /**
   * 
   */
  public stop() {
    cancelAnimationFrame(this.requestAnimationFrameId)

    this.requestAnimationFrameId = -1

    this.overlay.destroy()
  }

  on<E extends keyof Events>(event: E, callback: Events[E]) {
    return this.emitter.on(event, callback)
  }

  private getElements() {
    return this.elementsOrSelectors.reduce((elements, selectorOrElement) => {
      if (typeof selectorOrElement === 'string') {
        const findedElement = document.querySelectorAll(selectorOrElement)
  
        if (!findedElement) {
          throw new Error(
            `Can not find element by selector ${selectorOrElement}`
          )
        }
  
        return elements.concat(Array.from(findedElement))
      }
    
      return elements.concat([selectorOrElement])
    }, [] as Element[])
  }

  private getPosition(element:Element):Rect {
    const domRect = element.getBoundingClientRect()

    return new Rect(
      domRect.left,
      domRect.top,
      domRect.width,
      domRect.height,
    )
  }

  private watch() {
    const rect = this.calcBox()

    if (!isEqualDOMRect(this.rect, rect)) {
      if (!rect) {
        this.rect = rect
      } else {
        if (!this.rect) {
          this.rect = new Rect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
          )
        } else {
          this.rect.x = rect.x
          this.rect.y = rect.y
          this.rect.width = rect.width
          this.rect.height = rect.height
        }
      }

      this.overlay.rect = this.rect ? this.rect : new Rect()
      /**
       * Called when the position or size of the highlight area has
       * changed
       *
       * @event BoxOverlay#updateRect
       * @type {Rect|null}
       */
      this.emitter.emit(BoxOverlay.updateRect, this.rect)
    }

    this.requestAnimationFrameId = requestAnimationFrame(() => {
      this.watch()
    })
  }

  private calcBox() {
    const elements = this.getElements()

    if (elements.length === 0) {
      return null
    }

    let x = MAX_SAFE_INTEGER
    let y = MAX_SAFE_INTEGER
    let width = 0
    let height = 0
    let bottom = 0
    let right = 0
    
    elements.map(this.getPosition).forEach((elRect) => {
      x = Math.min(elRect.x, x)
      y = Math.min(elRect.y, y)
      right = Math.max(elRect.x + elRect.width, right)
      bottom = Math.max(elRect.y + elRect.height, bottom)
    })

    width = right - x
    height = bottom - y

    return { x, y, width, height }
  }

  static updateRect = updateRect
}
