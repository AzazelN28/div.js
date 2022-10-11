import Point from '../math/Point'
import RenderableComponent from '../components/RenderableComponent'

export class RenderableScrollLayer extends RenderableComponent {
  constructor({ entity, source } = {}) {
    super({ entity })
    this.source = source
    // TODO: Esto debería estar en una clase Transform o algo del estilo.
    this.position = new Point()
    this.rotation = 0
    this.scale = new Point(1, 1)
  }
}

export default class RenderableScroll {
  #layers

  constructor({ layers }) {
    this.#layers = layers
  }
}
