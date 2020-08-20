import { hasChild, setDefaultOverlayStyles, applyStyle } from './utils'

export class Overlay {
  private element = document.createElement('div')
  private disableEventsElement = document.createElement('div')
  private option = {
    disableEvents: false,
  }

  constructor() {
    const { element, disableEventsElement } = this

    setDefaultOverlayStyles(element)
    applyStyle(
      element, 
      {
        pointerEvents: 'none',
        willСhange: 'transform, width, height',
      }
    )
    setDefaultOverlayStyles(disableEventsElement)
    applyStyle(
      disableEventsElement, 
      {
        right: '0',
        bottom: '0',
        willСhange: 'clip-path',
      }
    )

    disableEventsElement.onclick = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    this.applyStyle()
  }

  private style = {
    color: 'rgba(0,0,0,.5)',
    borderRadius: 5,
    zIndex: 10000,
  }

  set disableEvents(bool:boolean) {
    this.option.disableEvents = bool
  }

  get disableEvents() {
    return this.option.disableEvents
  }

  set color(color:string) {
    this.style.color = color

    requestAnimationFrame(() => {
      this.applyStyle()
    })
  }

  get color() {
    return this.style.color
  }

  get borderRadius() {
    return this.style.borderRadius
  }

  set borderRadius(radius:number) {
    this.style.borderRadius = radius

    requestAnimationFrame(() => {
      this.applyStyle()
    })
  }

  get zIndex() {
    return this.style.zIndex
  }

  set zIndex(zIndex:number) {
    this.style.zIndex = zIndex

    requestAnimationFrame(() => {
      this.applyStyle()
    })
  }

  public getElement() {
    return this.element
  }

  public setRect(rect:DOMRect|null) {
    if (rect) {
      this.mount()

      applyStyle(this.element, {
        transform: `translate(${rect.x}px, ${rect.y}px)`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      })

      const clipPath = this.disableEvents 
        ? 'none'
        : (
          'polygon(0% 0%, 0 100%,'
          + `${rect.x}px 100%,`
          + `${rect.x}px ${rect.y}px,`
          + `${rect.x + rect.width}px ${rect.y}px,`
          + `${rect.x + rect.width}px ${rect.y + rect.height}px,`
          + `${rect.x}px ${rect.y + rect.height}px,`
          + `${rect.x}px 100%,`
          + '100% 100%, 100% 0%)'
        )

      applyStyle(
        this.disableEventsElement, 
        { clipPath: clipPath, },
      )
    } else {
      this.destroy()
    }
  }

  public mount() {
    const { element, disableEventsElement } = this
    const { body } = document

    if (!hasChild(body, element)) {
      body.appendChild(element)
    }

    if (!hasChild(body, disableEventsElement)) {
      body.appendChild(disableEventsElement)
    }
  }

  public destroy() {
    const { element, disableEventsElement } = this
    const { body } = document

    if (hasChild(body, element)) {
      body.removeChild(element)
    }

    if (hasChild(body, disableEventsElement)) {
      body.removeChild(disableEventsElement)
    }
  }

  private applyStyle() {
    const { element, style } = this

    applyStyle(element, {
      boxShadow: `0 0 0 40000px ${style.color}`,
      borderRadius: `${style.borderRadius}px`,
      zIndex: `${style.zIndex}`,
    })
    applyStyle(element, {
      zIndex: `${style.zIndex + 1}`,
    })
  }
}
