import Vector3 from './Vector3';

export default class Box3 {
  constructor(position = new Vector3(), size = new Vector3()) {
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

  get z() {
    return this.position.z
  }

  set z(value) {
    this.position.z = value
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

  get depth() {
    return this.size.z
  }

  get halfDepth() {
    return this.size.z * 0.5
  }

  set depth(value) {
    this.size.z = value
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

  get front() {
    return this.z
  }

  get back() {
    return this.z + this.depth
  }

  get minX() {
    return this.left
  }

  get minY() {
    return this.top
  }

  get minZ() {
    return this.front
  }

  get maxX() {
    return this.right
  }

  get maxY() {
    return this.bottom
  }

  get maxZ() {
    return this.back
  }

  get centerX() {
    return this.x + this.halfWidth
  }

  get centerY() {
    return this.y + this.halfHeight
  }

  get centerZ() {
    return this.z + this.halfDepth
  }

  set(x, y, z, width, height, depth) {
    this.position.set(x, y, z)
    this.size.set(width, height, depth)
    return this
  }

  reset() {
    return this.set(0, 0, 0, 0, 0, 0)
  }

  copy({ x, y, z, width, height, depth }) {
    return this.set(x, y, z, width, height, depth)
  }

  clone() {
    return new Box3(this.position.clone(), this.size.clone())
  }

  contains({ x, y, z }) {
    return (
      x >= this.left &&
      x < this.right &&
      y >= this.top &&
      y < this.bottom &&
      z >= this.front &&
      z < this.back
    )
  }

  intersects({ left, right, top, bottom, front, back }) {
    if (this.left > right || this.right < left) {
      // en el eje x no coinciden
      return false
    }
    if (this.top > bottom || this.bottom < top) {
      // en el eje y no coinciden
      return false
    }
    if (this.front > back || this.back < front) {
      // en el eje z no coinciden
      return false
    }
    return true
  }

  toFixed(fractionDigits = 0) {
    return `Box3(${this.position.toFixed(fractionDigits)}, ${this.size.toFixed(
      fractionDigits
    )})`
  }

  toString() {
    return `Box3(${this.position}, ${this.size})`
  }
}
