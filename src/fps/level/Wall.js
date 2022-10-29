import Vector2 from '../../math/Vector2'
import Line from '../../math/Line'

class WallPart {
  constructor() {
    this.texture = '/assets/texture/WALL30_4.png'
    this.textureOffset = new Vector2()
  }
}
export default class Wall {
  constructor({ line = null, front = null, back = null } = {}) {
    this.line = line
    // NOTA! Esto lo he utilizado para debuggear
    // cosas del Collider del nivel pero por lo
    // demás no creo que sea muy útil.
    // this.d = 0
    this.delta = new Vector2()
    this.tangent = new Vector2()
    this.normal = new Vector2()
    this.center = new Vector2()
    this.top = new WallPart() // texturas de la pared.
    this.middle = new WallPart() // texturas de la pared.
    this.bottom = new WallPart() // texturas de la pared.
    this.front = front // sector frontal
    this.back = back // sector trasero
    // TODO: Tiene que haber una forma mejor de indicar modificadores
    // de pared.
    this.isWalkable = true
    this.isMasked = false
  }

  get start() {
    return this.line.start
  }

  get end() {
    return this.line.end
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
    this.delta.copy(this.line.start).subtract(this.line.end)
    this.tangent.copy(this.delta).normalize()
    this.normal.copy(this.tangent).perpRight()
    this.center.linear(0.5, this.line.start, this.line.end)
  }
}
