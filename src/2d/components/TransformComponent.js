import EntityComponent from '../../core/EntityComponent'
import Point from '../../math/Point'

export default class TransformComponent extends EntityComponent {
  constructor({ entity, position = new Point(), rotation = 0, scale = new Point(1, 1) } = {}) {
    super(entity)
    this.position = position
    this.rotation = rotation
    this.scale = scale
  }

  onDestroy() {
    this.position.reset()
    this.rotation = 0
    this.scale.set(1, 1)
  }
}
