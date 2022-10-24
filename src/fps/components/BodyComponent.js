import EntityComponent from '../../core/EntityComponent'
import Vector3 from '../../math/Vector3'

export default class BodyComponent extends EntityComponent {
  constructor() {
    this.velocity = new Vector3()
    this.friction = 1
    this.gravity = 1
    this.height = 8
    this.radius = 8
    this.collision = 'die'
    this.onFloor = false
    this.sector = null
    this.walls = new Set()
    this.stepSize = 16
  }
}
