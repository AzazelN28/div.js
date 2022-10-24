import Vector2 from '../../math/Vector2'

export class WallTextures {
  constructor() {
    this.top = null
    this.middle = null
    this.bottom = null
  }
}

export default class Wall extends Line {
  constructor() {
    super()
    this.delta = new Vector2()
    this.tangent = new Vector2()
    this.normal = new Vector2()
    this.center = new Vector2()
    this.textures = new WallTextures()
    this.front = null
    this.back = null
    this.isWalkable = true
  }

  get isSingleSided() {
    return this.front && !this.back
  }

  get isDoubleSided() {
    return this.front && this.back
  }

  get length() {
    return this.delta.length
  }

  compute() {
    this.delta.copy(this.start).subtract(this.end)
    this.tangent.copy(this.delta).normalize()
    this.normal.copy(this.tangent).perpRight()
  }
}
