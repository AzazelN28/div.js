import EntityComponent from '../../core/EntityComponent'

export default class SpriteComponent extends EntityComponent {
  constructor({ entity, source = null, width = 16, height = 16, pivot = 16 } = {}) {
    super(entity)
    this.source = source
    this.width = width
    this.height = height
    this.pivot = pivot
  }
}
