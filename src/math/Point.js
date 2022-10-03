export default class Point {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  get length() {
    return Math.hypot(this.x, this.y)
  }

  get direction() {
    return Math.atan2(this.y, this.x)
  }

  set(x, y) {
    this.x = x
    this.y = y
    return this
  }

  reset() {
    return this.set(0, 0)
  }

  copy({ x, y }) {
    return this.set(x, y)
  }

  clone() {
    return new Point(this.x, this.y)
  }

  add({ x, y }) {
    return this.set(this.x + x, this.y + y)
  }

  subtract({ x, y }) {
    return this.set(this.x - x, this.y - y)
  }

  multiply({ x, y }) {
    return this.set(this.x * x, this.y * y)
  }

  divide({ x, y }) {
    return this.set(this.x / x, this.y / y)
  }

  scale(s) {
    return this.set(this.x * s, this.y * s)
  }

  normalize() {
    const l = this.length
    return this.set(this.x / l, this.y / l)
  }

  negate() {
    return this.set(-this.x, -this.y)
  }

  floor() {
    return this.set(Math.floor(this.x), Math.floor(this.y))
  }

  ceil() {
    return this.set(Math.ceil(this.x), Math.ceil(this.y))
  }

  trunc() {
    return this.set(Math.trunc(this.x), Math.trunc(this.y))
  }

  perpLeft() {
    return this.set(this.y, -this.x)
  }

  perpRight() {
    return this.set(-this.y, this.x)
  }

  rotate(angle) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return this.set(
      this.x * c - this.y * s,
      this.x * s + this.y * c
    )
  }

  distanceTo({ x, y }) {
    return Math.hypot(this.x - x, this.y - y)
  }

  directionTo({ x, y }) {
    return Math.atan2(this.y - y, this.x - x)
  }

  constrainTo(rect) {
    if (this.x < rect.left)
      this.x = rect.left
    else if (this.x > rect.right)
      this.x = rect.right

    if (this.y < rect.top)
      this.y = rect.top
    else if (this.y > rect.bottom)
      this.y = rect.bottom

    return this
  }

  toFixed(fractionDigits = 0) {
    return `Point(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(
      fractionDigits
    )})`
  }

  toString() {
    return `Point(${this.x}, ${this.y})`
  }
}
