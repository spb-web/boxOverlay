import { hasChild, applyStyle } from './utils'
import { Rect } from './Rect'

export class Overlay {
  private readonly canvas = document.createElement('canvas')
  private readonly resizeObserver = new ResizeObserver(
    (entries) => this.handleResize(entries)
  )
  private readonly ctx:CanvasRenderingContext2D
  private readonly disableEventsElement = document.createElement('div')
  private requestAnimationFrameId:number|null = null
  private readonly data: {
    disableMouseEvents:boolean,
    rect:Rect,
  } = {
    disableMouseEvents: true,
    rect: new Rect(),
  }
  private readonly style = {
    color: 'rgba(0,0,0,.5)',
    borderRadius: 5,
    zIndex: 10000,
  }

  /**
   * @class Overlay
   */
  constructor() {
    const { canvas } = this
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error()
    }

    this.ctx = ctx

    this.resizeObserver.observe(canvas)
    this.applyCanvasStyle()
  }

  /**
   * 
   */
  public get color() {
    return this.style.color
  }

  public set color(color:string) {
    this.style.color = color

    this.draw()
  }

  /**
   * 
   */
  public get borderRadius() {
    return this.style.borderRadius
  }

  public set borderRadius(radius:number) {
    this.style.borderRadius = radius

    this.draw()
  }

  /**
   * @returns {number}
   */
  public get zIndex(): number {
    return this.style.zIndex
  }

  public set zIndex(zIndex:number) {
    this.style.zIndex = zIndex

    requestAnimationFrame(() => {
      this.applyCanvasStyle()
    })
  }

  public set disableMouseEvents(isDisable:boolean) {
    this.data.disableMouseEvents = isDisable

    if (this.rect) {
      this.updateRect(this.rect)
    }
  }

  public get disableMouseEvents() {
    return this.data.disableMouseEvents
  }

  public set rect(rect:Rect) {
    this.data.rect = rect

    if (rect) {
      this.updateRect(rect)
    } else {
      this.destroy()
    }
  }

  public get rect() {
    return this.data.rect
  }

  /**
   * @returns {HTMLCanvasElement}
   */
  public getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  /**
   * 
   */
  public mount() {
    const { canvas, disableEventsElement } = this
    const { body } = document

    if (!hasChild(body, canvas)) {
      body.appendChild(canvas)
    }

    if (!hasChild(body, disableEventsElement)) {
      body.appendChild(disableEventsElement)
    }
  }

  /**
   * 
   */
  public destroy() {
    const { canvas, disableEventsElement } = this
    const { body } = document

    if (hasChild(body, canvas)) {
      body.removeChild(canvas)
    }

    if (hasChild(body, disableEventsElement)) {
      body.removeChild(disableEventsElement)
    }
  }

  private applyCanvasStyle() {
    const { canvas, disableEventsElement } = this

    applyStyle(
      canvas,
      {
        zIndex: this.style.zIndex.toString(10),
        pointerEvents: 'none',
        position: 'fixed',
        width: '100%',
        height: '100%',
        left: '0',
        top: '0',
      },
    )

    applyStyle(
      disableEventsElement,
      {
        position: 'fixed',
        left: '0',
        top: '0',
        bottom: '0',
        right: '0',
      }
    )
  }

  private draw() {
    const { 
      requestAnimationFrameId,
      ctx,
      canvas: { width: canvasWidth, height: canvasHeight }
    } = this

    if (requestAnimationFrameId) {
      cancelAnimationFrame(requestAnimationFrameId)
    }

    this.requestAnimationFrameId = requestAnimationFrame(() => {
      const { devicePixelRatio } = window

      // Background
      ctx.globalCompositeOperation = 'copy'
      ctx.fillStyle = this.style.color

      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Window
      ctx.globalCompositeOperation = 'destination-out'

      const x = this.data.rect.x * devicePixelRatio 
      const y = this.data.rect.y * devicePixelRatio
      const width = this.data.rect.width * devicePixelRatio
      const height = this.data.rect.height * devicePixelRatio
      const radius = this.style.borderRadius * devicePixelRatio

      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()

      ctx.fillStyle = '#000'
      ctx.fill()
    })
  }

  private handleResize([{
    contentRect: { width, height }
  }]:ResizeObserverEntry[]) {
    const { canvas } = this
    const { devicePixelRatio } = window

    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio

    this.draw()
  }

  private updateRect(rect:Rect) {
    this.mount()
    this.draw()

    const disableEventsElementStyle = {
      clipPath: 'none',
      willСhange: 'none',
    }

    if (!this.disableMouseEvents) {
      disableEventsElementStyle.clipPath = 'polygon(0% 0%, 0 100%,'
      + `${rect.x}px 100%,`
      + `${rect.x}px ${rect.y}px,`
      + `${rect.x + rect.width}px ${rect.y}px,`
      + `${rect.x + rect.width}px ${rect.y + rect.height}px,`
      + `${rect.x}px ${rect.y + rect.height}px,`
      + `${rect.x}px 100%,`
      + '100% 100%, 100% 0%)'

      disableEventsElementStyle.willСhange = 'clip-path'
    }

    applyStyle(
      this.disableEventsElement, 
      disableEventsElementStyle,
    )
  }
}
