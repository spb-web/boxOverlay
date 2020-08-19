import { Overlay } from './Overlay'

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
    this.calcBox()
    this.handleUpdate(this.rect)
    this.overlay.setRect(this.rect)

    this.requestAnimationFrameId = requestAnimationFrame(() => {
      this.watch()
    })
  }

  private calcBox() {
    const elements = this.getElements()

    if (elements.length === 0) {
      this.rect = null

      return
    }

    if (this.rect === null) {
      this.rect = new DOMRect(
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        0,
        0
      )
    } else {
      this.rect.x = Number.MAX_SAFE_INTEGER
      this.rect.y = Number.MAX_SAFE_INTEGER
      this.rect.width = 0
      this.rect.height = 0
    }

    const boxRect = this.rect

    let bottom = 0
    let right = 0
    
    elements.map(this.getPosition).forEach((elRect) => {
      boxRect.x = Math.min(elRect.x, boxRect.x)
      boxRect.y = Math.min(elRect.y, boxRect.y)
      right = Math.max(elRect.x + elRect.width, right)
      bottom = Math.max(elRect.y + elRect.height, bottom)
    })

    boxRect.width = right - boxRect.x
    boxRect.height = bottom - boxRect.y
  }
}
