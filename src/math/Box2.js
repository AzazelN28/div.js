import Vector2 from './Vector2'

export default class Box2 {
  constructor(position = new Vector2(), size = new Vector2()) {
    this.position = position
    this.size = size
  }

  get x() {
    return this.position.x
  }

  set x(value) {
    this.position.x = value
  }

  get y() {
    return this.position.y
  }

  set y(value) {
    this.position.y = value
  }

  get width() {
    return this.size.x
  }

  set width(value) {
    this.size.x = value
  }

  get halfWidth() {
    return this.size.x * 0.5
  }

  get height() {
    return this.size.y
  }

  get halfHeight() {
    return this.size.y * 0.5
  }

  set height(value) {
    this.size.y = value
  }

  get left() {
    return this.x
  }

  get top() {
    return this.y
  }

  get right() {
    return this.x + this.width
  }

  get bottom() {
    return this.y + this.height
  }

  get minX() {
    return this.left
  }

  get minY() {
    return this.top
  }

  get maxX() {
    return this.right
  }

  get maxY() {
    return this.bottom
  }

  get centerX() {
    return this.x + this.halfWidth
  }

  get centerY() {
    return this.y + this.halfHeight
  }

  set(x, y, width, height) {
    this.position.set(x, y)
    this.size.set(width, height)
    return this
  }

  reset() {
    return this.set(0, 0, 0, 0)
  }

  copy({ x, y, width, height }) {
    return this.set(x, y, width, height)
  }

  clone() {
    return new Box2(this.position.clone(), this.size.clone())
  }

  contains({ x, y }) {
    return (
      x >= this.left &&
      x < this.right &&
      y >= this.top &&
      y < this.bottom
    )
  }

  intersects({ left, right, top, bottom }) {
    if (this.left > right || this.right < left) {
      // en el eje x no coinciden
      return false
    }
    if (this.top > bottom || this.bottom < top) {
      // en el eje y no coinciden
      return false
    }
    return true
  }

  toFixed(fractionDigits = 0) {
    return `Box2(${this.position.toFixed(fractionDigits)}, ${this.size.toFixed(fractionDigits)})`
  }

  toString() {
    return `Box2(${this.position}, ${this.size})`
  }
}
