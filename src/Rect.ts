export class Rect {
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
  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0,
  ) {}

  /**
   * @property {number} top
   */
  public get top() {
    return this.y + Math.min(0, this.height)
  }

  /**
   * @property {number} bottom
   */
  public get bottom() {
    return this.y + Math.max(0, this.height)
  }

  /**
   * @property {number} left
   */
  public get left() {
    return this.x + Math.min(0, this.width)
  }

  /**
   * @property {number} right
   */
  public get right() {
    return this.x + Math.max(0, this.width)
  }
}
