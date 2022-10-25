import EntityComponent from '../../core/EntityComponent'

export default class FacetedSpriteComponent extends EntityComponent {
  constructor({ entity, sources = [], width = 16, height = 16, pivot = 16 } = {}) {
    super(entity)
    this.sources = sources
    this.width = width
    this.height = height
    this.pivot = pivot
    this.isFlipped = true
  }
}
