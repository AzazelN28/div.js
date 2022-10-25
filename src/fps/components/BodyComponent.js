import EntityComponent from '../../core/EntityComponent'
import Vector3 from '../../math/Vector3'
import { CollisionMode } from '../systems/Collider'

export default class BodyComponent extends EntityComponent {
  constructor({ entity } = {}) {
    super(entity)
    this.velocity = new Vector3()
    this.friction = 0.95
    this.gravity = 1
    this.height = 32
    this.radius = 16
    this.collisionMode = CollisionMode.DIE
    this.sector = null
    this.walls = new Set()
    this.stepSize = 16
    this.onFloor = false
  }
}
