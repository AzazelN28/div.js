import Vector3 from './Vector3';

export default class Box3 {
  constructor(position = new Vector3(), size = new Vector3()) {
    this.position = position
    this.size = size
  }

  get minX() {
    return this.position.x
  }

  get maxX() {
    return this.position.x + this.size.x
  }

  get minY() {
    return this.position.y
  }

  get maxY() {
    return this.position.y + this.size.y
  }

  get minZ() {
    return this.position.z
  }

  get maxZ() {
    return this.position.z + this.size.z
  }

  contains({ x, y, z }) {
    return x >= this.minX && x < this.maxX
        && y >= this.minY && y < this.maxY
        && z >= this.minZ && z < this.maxZ
  }

  toString() {
    return `${this.constructor.name}(${this.position}, ${this.size})`
  }
}
