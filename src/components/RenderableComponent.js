import EntityComponent from '../core/EntityComponent'
import Point from '../math/Point'

export default class RenderableComponent extends EntityComponent {
  constructor({ entity, renderer, size = new Point(), pivot = new Point(), opacity = 1, compositeOperation = 'source-over' }) {
    super(entity)
    this.renderer = renderer
    this.size = size
    this.pivot = pivot
    this.opacity = opacity
    this.compositeOperation = compositeOperation
  }

  destroy() {
    this.renderer.destroyComponent(this)
    super.destroy()
  }
}
