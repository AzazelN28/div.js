import EntityComponent from '../../core/EntityComponent'
import Vector2 from '../../math/Vector2'

export default class UISpriteComponent extends EntityComponent {
  constructor({ entity, source } = {}) {
    super(entity)
    this.source = source
    this.autoPivot = null
    this.pivot = new Vector2()
    this.flip = new Vector2(0, 1)
    this.size = new Vector2(source.width, source.height)
  }
}
