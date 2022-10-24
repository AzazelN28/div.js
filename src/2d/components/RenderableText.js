import RenderableComponent from '../components/RenderableComponent'

export default class RenderableText extends RenderableComponent {
  constructor({ entity = null, text, fillStyle, strokeStyle } = {}) {
    super({ entity })
    this.text = text
    this.fillStyle = fillStyle
    this.strokeStyle = strokeStyle
  }
}
