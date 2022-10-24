import RenderableComponent from './RenderableComponent'

export default class RenderableSprite extends RenderableComponent {
  /**
   * @type {CanvasImageSource}
   */
  #source = null

  constructor({ entity, source } = {}) {
    super({ entity })
    this.#source = source
  }

  get source() {
    return this.#source
  }
}
