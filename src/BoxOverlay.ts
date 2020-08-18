import { Overlay } from './Overlay'

export class BoxOverlay {
  public overlay = new Overlay()

  constructor(handleUpdate = (rect:DOMRect|null) => {}) {
    this.handleUpdate = handleUpdate
  }

  private handleUpdate:(rect:DOMRect|null) => void

  private elements:Element[] = []

  private rect:DOMRect|null = null

  private requestAnimationFrameId:number = -1

  public add(selectorOrElement:Element|string) {
    try {
      const elements = this.getElements(selectorOrElement)

      this.elements.push(...elements)
    } catch (error) {
      console.error(error)
    }
  }

  public remove(selectorOrElement:Element|string) {
    if (typeof selectorOrElement === 'string') {
      this.elements = this.elements.filter(item => !item.matches(selectorOrElement))
    } else {
      this.elements = this.elements.filter(item => item !== selectorOrElement)
    }
  }

  public clear() {
    this.elements = []
  }

  private getElements(selectorOrElement:Element|string) {
    if (typeof selectorOrElement === 'string') {
      const findedElement = document.querySelectorAll(selectorOrElement)

      if (!findedElement) {
        throw new Error(
          `Can not find element by selector ${selectorOrElement}`
        )
      }

      return Array.from(findedElement)
    }
  
    return [selectorOrElement]
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
    if (this.elements.length === 0) {
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
    
    this.elements.map(this.getPosition).forEach((elRect) => {
      boxRect.x = Math.min(elRect.x, boxRect.x)
      boxRect.y = Math.min(elRect.y, boxRect.y)
      right = Math.max(elRect.x + elRect.width, right)
      bottom = Math.max(elRect.y + elRect.height, bottom)
    })

    boxRect.width = right - boxRect.x
    boxRect.height = bottom - boxRect.y
  }
}
