import Scalar from './Scalar'

export default class Vector3 {
  static distanceBetween({ x: ax, y: ay, z: az }, { x: bx, y: by, z: bz }) {
    return Math.hypot(ax - bx, ay - by, az - bz)
  }

  /**
   * Punto
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  /**
   * Magnitud del vector
   *
   * @type {number}
   */
  get length() {
    return Math.hypot(this.x, this.y, this.z)
  }

  get isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(this.z)
  }

  get isInteger() {
    return Number.isInteger(this.x) && Number.isInteger(this.y) && Number.isInteger(this.z)
  }

  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  reset() {
    return this.set(0, 0)
  }

  copy({ x, y, z }) {
    return this.set(x, y, z)
  }

  clone() {
    return new Point(this.x, this.y, this.z)
  }

  add({ x, y, z }) {
    return this.set(this.x + x, this.y + y, this.z + z)
  }

  subtract({ x, y, z }) {
    return this.set(this.x - x, this.y - y, this.z - z)
  }

  multiply({ x, y, z }) {
    return this.set(this.x * x, this.y * y, this.z * z)
  }

  divide({ x, y, z }) {
    return this.set(this.x / x, this.y / y, this.z / z)
  }

  scale(s) {
    return this.set(this.x * s, this.y * s, this.z * s)
  }

  normalize() {
    const l = this.length
    return this.set(this.x / l, this.y / l, this.z / l)
  }

  negate() {
    return this.set(-this.x, -this.y, -this.z)
  }

  dot({ x, y, z }) {
    return this.x * x + this.y * y + this.z * z
  }

  cross({ x, y, z }) {
    // TODO: calculamos el producto cruzado con otro vector
    // y retornamos un nuevo vector.
    // O BIEN PODEMOS ALMACENAR EL PRODUCTO CRUZADO DE LOS
    // DOS VECTORES EN ESTE VECTOR.
  }

  floor() {
    return this.set(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z))
  }

  ceil() {
    return this.set(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z))
  }

  round() {
    return this.set(Math.round(this.x), Math.round(this.y), Math.round(this.z))
  }

  trunc() {
    return this.set(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.z))
  }

  rotateX(angle) {
    // TODO:
  }

  rotateY(angle) {
    // TODO:
  }

  rotateZ(angle) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return this.set(this.x * c - this.y * s, this.x * s + this.y * c, this.z)
  }

  distanceTo({ x, y, z }) {
    return Math.hypot(this.x - x, this.y - y, this.z - z)
  }

  equal({ x, y, z }) {
    return Scalar.equal(this.x, x)
        && Scalar.equal(this.y, y)
        && Scalar.equal(this.z, z)
  }

  greater({ x, y, z }) {
    return Scalar.greaterOrEqual(this.x, x)
        && Scalar.greaterOrEqual(this.y, y)
        && Scalar.greaterOrEqual(this.z, z)
  }

  less({ x, y, z }) {
    return Scalar.less(this.x, x)
        && Scalar.less(this.y, y)
        && Scalar.less(this.z, z)
  }

  greaterOrEqual({ x, y, z }) {
    return Scalar.greaterOrEqual(this.x, x)
        && Scalar.greaterOrEqual(this.y, y)
        && Scalar.greaterOrEqual(this.z, z)
  }

  lessOrEqual({ x, y, z }) {
    return Scalar.lessOrEqual(this.x, x)
        && Scalar.lessOrEqual(this.y, y)
        && Scalar.lessOrEqual(this.z, z)
  }

  almostEqual({ x, y, z }, epsilon) {
    return Scalar.almostEqual(this.x, x, epsilon)
        && Scalar.almostEqual(this.y, y, epsilon)
        && Scalar.almostEqual(this.z, z, epsilon)
  }

  toFixed(fractionDigits = 0) {
    return `Vector3(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(
      fractionDigits
    )})`
  }

  toString() {
    return `Vector3(${this.x}, ${this.y})`
  }
}
