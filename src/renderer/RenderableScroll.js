import Point from '../math/Point'

export class RenderableScrollLayer {
  constructor({ source }) {
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
