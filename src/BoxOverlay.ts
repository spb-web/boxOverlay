import { Overlay } from './Overlay'
import { isEqualDOMRect } from './utils'

const { MAX_SAFE_INTEGER } = Number

export class BoxOverlay {
  public overlay = new Overlay()

  constructor(handleUpdate = (rect:DOMRect|null) => {}) {
    this.handleUpdate = handleUpdate
  }

  private handleUpdate:(rect:DOMRect|null) => void

  private elementsOrSelectors:(Element|string)[] = []

  private rect:DOMRect|null = null

  private requestAnimationFrameId:number = -1

  public add(selectorOrElement:Element|string) {
    this.elementsOrSelectors.push(selectorOrElement)
  }

  public clear() {
    this.elementsOrSelectors = []
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

  private getPosition(element:Element) {
    const domRect = element.getBoundingClientRect()

    return domRect
  }

  public start() {
    this.watch()
  }

  public stop() {
    cancelAnimationFrame(this.requestAnimationFrameId)

    this.requestAnimationFrameId = -1

    this.overlay.destroy()
  }

  private watch() {
    const rect = this.calcBox()

    if (!isEqualDOMRect(this.rect, rect)) {
      if (!rect) {
        this.rect = rect
      } else {
        if (!this.rect) {
          this.rect = new DOMRect(
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

      this.overlay.setRect(this.rect)
      this.handleUpdate(this.rect)
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
}
