import RenderableRect from '../components/RenderableRect'
import RenderableScroll from '../components/RenderableScroll'
import RenderableSpritesheet from '../components/RenderableSpritesheet'
import RenderableSprite from '../components/RenderableSprite'
import RenderableText from '../components/RenderableText'

export default class Renderer {
  #context
  #components = new Set()
  #debug = []

  constructor({ context }) {
    this.#context = context
    this.#components = new Set()
    this.#debug = []
  }

  get debug() {
    return this.#debug
  }

  createComponent(constructor, ...args) {
    const component = new constructor(...args)
    component.renderer = this
    this.#components.add(component)
    return component
  }

  destroyComponent(component) {
    component.entity = null
    return this.#components.delete(component)
  }

  createText(...args) {
    return this.createComponent(RenderableText, ...args)
  }

  createRect(...args) {
    return this.createComponent(RenderableRect, ...args)
  }

  // TODO: Esto debería llamarse algo como "static"
  createSprite(...args) {
    return this.createComponent(RenderableSprite, ...args)
  }

  // TODO: Esto debería llamarse algo como "animated"
  createSpritesheet(...args) {
    return this.createComponent(RenderableSpritesheet, ...args)
  }

  createScroll(...args) {
    return this.createComponent(RenderableScroll, ...args)
  }

  render(time) {
    this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height)
    for (const component of this.#components) {
      if (!component.entity) {
        continue
      }
      const transform = component.entity.get('transform')
      this.#context.save()
      this.#context.translate(transform.position.x, transform.position.y)
      this.#context.rotate(transform.rotation)
      this.#context.scale(transform.scale.x, transform.scale.y)
      this.#context.globalAlpha = component.opacity
      this.#context.globalCompositeOperation = component.compositeOperation
      if (component instanceof RenderableText) {
        this.#context.fillStyle = component.fillStyle
        this.#context.fillText(component.text, -component.pivot.x, -component.pivot.y)
      } else if (component instanceof RenderableSpritesheet) {
        this.#context.drawImage(
          component.source,
          component.sx,
          component.sy,
          component.sw,
          component.sh,
          -component.pivot.x,
          -component.pivot.y,
          component.sw,
          component.sh
        )
      } else if (component instanceof RenderableSprite) {
        this.#context.drawImage(component.source, -component.pivot.x, -component.pivot.y)
      } else if (component instanceof RenderableScroll) {
        for (let layerIndex = 0; layerIndex < component.layers.length; layerIndex++) {
          const layer = component.layers[layerIndex]
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
      } else if (component instanceof RenderableRect) {
        if (component.fill) {
          this.#context.fillStyle = component.fill
          this.#context.fillRect(component.rect.x, component.rect.y, component.rect.width, component.rect.height)
        }
        if (component.stroke) {
          this.#context.strokeStyle = component.stroke
          this.#context.strokeRect(component.rect.x, component.rect.y, component.rect.width, component.rect.height)
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
