import { hasChild } from './utils'

export class Overlay {
  private element = document.createElement('div')

  constructor() {
    this.element.style.position = 'fixed'
    this.element.style.left = '0'
    this.element.style.top = '0'
    this.element.style.pointerEvents = 'none'

    this.applyStyle()
  }

  private style = {
    color: 'rgba(0,0,0,.5)',
    borderRadius: 5,
    zIndex: 10000,
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

  public getElement() {
    return this.element
  }

  public setRect(rect:DOMRect|null) {
    if (rect) {
      this.mount()
      
      this.element.style.transform = `translate(${rect.x}px, ${rect.y}px)`
      this.element.style.width = `${rect.width}px`
      this.element.style.height = `${rect.height}px`
    } else {
      this.destroy()
    }
  }

  public mount() {
    if (!hasChild(document.body, this.element)) {
      document.body.appendChild(this.element)
    }
  }

  public destroy() {
    if (hasChild(document.body, this.element)) {
      document.body.removeChild(this.element)
    }
  }

  private applyStyle() {
    this.element.style.setProperty(
      'box-shadow',
      `0 0 0 20000px ${this.style.color}`
    )
    this.element.style.setProperty(
      'border-radius', 
      `${this.style.borderRadius}px`,
    )
    this.element.style.setProperty(
      'z-index', 
      `${this.style.zIndex}`,
    )
  }
}
