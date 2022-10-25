import Box2 from '../../math/Box2'
import Vector2 from '../../math/Vector2'

export class SectorPlane {
  constructor() {
    this.height = 0
    this.texture = '/assets/texture/SLIME15.png'
    this.textureOffset = new Vector2()
  }
}

export default class Sector {
  constructor({ walls = [] } = {}) {
    // TODO: Ya veremos cómo implementamos esta mandanga de los sectores
    // superiores e inferiores.
    this.above = null // Sector superior
    this.below = null // Sector inferior
    this.floor = new SectorPlane()
    this.ceiling = new SectorPlane()
    this.boundingBox = new Box2()
    this.walls = walls
  }

  compute() {
    this.boundingBox.envelopStart()
    for (const wall of this.walls) {
      this.boundingBox.envelop(wall.line.start)
      this.boundingBox.envelop(wall.line.end)
    }
  }
}
