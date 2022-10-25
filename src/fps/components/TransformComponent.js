import EntityComponent from '../../core/EntityComponent'
import Vector2 from '../../math/Vector2'
import Vector3 from '../../math/Vector3'

export default class TransformComponent extends EntityComponent {
  constructor({ entity, position = new Vector3(0, 0, 0), rotation = 0, scale = new Vector3(1, 1, 1), direction = new Vector2() } = {}) {
    super(entity)
    this.position = position
    this.rotation = rotation
    this.direction = direction
    this.scale = scale
  }
}
