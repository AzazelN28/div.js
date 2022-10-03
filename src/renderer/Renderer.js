import RenderableRect from './RenderableRect'
import RenderableScroll from './RenderableScroll'
import RenderableSpritesheet from './RenderableSpritesheet'
import RenderableText from './RenderableText'

export default class Renderer {
  #context
  #core
  #debug

  constructor({ context, core }) {
    this.#context = context
    this.#core = core
    this.#debug = []
  }

  get debug() {
    return this.#debug
  }

  render(time) {
    this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height)
    for (const process of this.#core.processes) {
      this.#context.save()
      this.#context.translate(process.position.x, process.position.y)
      this.#context.rotate(process.rotation)
      this.#context.scale(process.scale.x, process.scale.y)
      this.#context.globalAlpha = process.opacity
      this.#context.globalCompositeOperation = process.compositeOperation
      if (process.renderable instanceof RenderableText) {
        this.#context.fillStyle = process.renderable.fillStyle
        this.#context.fillText(process.renderable.text, -process.pivot.x, -process.pivot.y)
      } else if (process.renderable instanceof RenderableSpritesheet) {
        this.#context.drawImage(
          process.renderable.source,
          process.renderable.sx,
          process.renderable.sy,
          process.renderable.sw,
          process.renderable.sh,
          -process.pivot.x,
          -process.pivot.y,
          process.renderable.sw,
          process.renderable.sh
        )
      } else if (process.renderable instanceof Image || process.renderable instanceof ImageBitmap) {
        this.#context.drawImage(process.renderable, -process.pivot.x, -process.pivot.y)
      } else if (process.renderable instanceof RenderableScroll) {
        for (let layerIndex = 0; layerIndex < process.renderable.layers.length; layerIndex++) {
          const layer = process.renderable.layers[layerIndex]
          this.#context.save()
          this.#context.translate(layer.position.x, layer.position.y)
          this.#context.rotate(layer.rotation)
          this.#context.scale(layer.scale.x, layer.scale.y)
          this.#context.drawImage(
            layer.source,
            0, 0
          )
          this.#context.restore()
        }
      } else if (process.renderable instanceof RenderableRect) {
        if (process.renderable.fill) {
          this.#context.fillStyle = process.renderable.fill
          this.#context.fillRect(process.renderable.rect.x, process.renderable.rect.y, process.renderable.rect.width, process.renderable.rect.height)
        }
        if (process.renderable.stroke) {
          this.#context.strokeStyle = process.renderable.stroke
          this.#context.strokeRect(process.renderable.rect.x, process.renderable.rect.y, process.renderable.rect.width, process.renderable.rect.height)
        }
      }
      this.#context.restore()
    }
  }

  renderDebug(time) {
    this.#context.font = '16px monospace'
    this.#context.textAlign = 'left'
    this.#context.textBaseline = 'top'
    this.#context.fillStyle = '#0ff'
    this.#debug.forEach((fn, index) => this.#context.fillText(fn(), 0, index * 20))
  }
}
