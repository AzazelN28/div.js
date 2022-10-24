import RenderableComponent from './RenderableComponent'

export default class RenderableRect extends RenderableComponent {
  constructor({ entity = null, rect, stroke, fill } = {}) {
    super({ entity })
    this.rect = rect
    this.stroke = stroke
    this.fill = fill
  }
}
