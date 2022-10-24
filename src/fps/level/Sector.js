import Box2 from '../../math/Box2'

export class SectorPlane {
  constructor() {
    this.height = 0
    this.texture = null
  }
}

export default class Sector {
  constructor() {
    this.above = null
    this.below = null
    this.floor = new SectorPlane()
    this.ceiling = new SectorPlane()
    this.boundingBox = new Box2()
    this.walls = []
  }

  compute() {

  }
}
