import Scalar from './Scalar'
import Interpolation from './Interpolation'

export default class Vector2 {
  static distanceBetween({ x: ax, y: ay }, { x: bx, y: by }) {
    return Math.hypot(ax - bx, ay - by)
  }

  static directionBetween({ x: ax, y: ay }, { x: bx, y: by }) {
    return Math.atan2(ay - by, ax - bx)
  }

  /**
   * Vector bidimensional
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /**
   * Magnitud del vector
   *
   * @type {number}
   */
  get length() {
    return Math.hypot(this.x, this.y)
  }

  /**
   * Dirección del vector
   *
   * @type {number}
   */
  get direction() {
    return Math.atan2(this.y, this.x)
  }

  get isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y)
  }

  get isInteger() {
    return Number.isInteger(this.x) && Number.isInteger(this.y)
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
    return new Vector2(this.x, this.y)
  }

  polar(angle, length = 1) {
    return this.set(
      Math.cos(angle) * length,
      Math.sin(angle) * length
    )
  }

  add({ x, y }) {
    return this.set(this.x + x, this.y + y)
  }

  addScale({ x, y }, s) {
    return this.set(this.x + x * s, this.y + y * s)
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

  dot({ x, y }) {
    return this.x * x + this.y * y
  }

  cross({ x, y }) {
    return this.x * y - this.y * x
  }

  floor() {
    return this.set(Math.floor(this.x), Math.floor(this.y))
  }

  ceil() {
    return this.set(Math.ceil(this.x), Math.ceil(this.y))
  }

  round() {
    return this.set(Math.round(this.x), Math.round(this.y))
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
    return this.set(this.x * c - this.y * s, this.x * s + this.y * c)
  }

  distanceTo({ x, y }) {
    return Math.hypot(this.x - x, this.y - y)
  }

  directionTo({ x, y }) {
    return Math.atan2(this.y - y, this.x - x)
  }

  constrainTo(rect) {
    if (this.x < rect.left) {
      this.x = rect.left
    } else if (this.x > rect.right) {
      this.x = rect.right
    }
    if (this.y < rect.top) {
      this.y = rect.top
    } else if (this.y > rect.bottom) {
      this.y = rect.bottom
    }
    return this
  }

  linear(x, { x: ax, y: ay }, { x: bx, y: by }) {
    return this.set(
      Interpolation.linear(x, ax, bx),
      Interpolation.linear(x, ay, by)
    )
  }

  quadratic(x, { x: ax, y: ay }, { x: bx, y: by }, { x: cx, y: cy }) {
    return this.set(
      Interpolation.quadratic(x, ax, bx, cx),
      Interpolation.quadratic(x, ay, by, cy)
    )
  }

  cubic(x, { x: ax, y: ay }, { x: bx, y: by }, { x: cx, y: cy }, { x: dx, y: dy }) {
    return this.set(
      Interpolation.cubic(x, ax, bx, cx, dx),
      Interpolation.cubic(x, ay, by, cy, dy)
    )
  }

  equal({ x, y }) {
    return Scalar.equal(this.x, x) && Scalar.equal(this.y, y)
  }

  greater({ x, y }) {
    return Scalar.greaterOrEqual(this.x, x) && Scalar.greaterOrEqual(this.y, y)
  }

  less({ x, y }) {
    return Scalar.less(this.x, x) && Scalar.less(this.y, y)
  }

  greaterOrEqual({ x, y }) {
    return Scalar.greaterOrEqual(this.x, x) && Scalar.greaterOrEqual(this.y, y)
  }

  lessOrEqual({ x, y }) {
    return Scalar.lessOrEqual(this.x, x) && Scalar.lessOrEqual(this.y, y)
  }

  almostEqual({ x, y }, epsilon) {
    return (
      Scalar.almostEqual(this.x, x, epsilon) &&
      Scalar.almostEqual(this.y, y, epsilon)
    )
  }

  almostZero() {
    return this.almostEqual({ x: 0, y: 0 })
  }

  toFixed(fractionDigits = 0) {
    return `Vector2(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(
      fractionDigits
    )})`
  }

  toString() {
    return `Vector2(${this.x}, ${this.y})`
  }
}
