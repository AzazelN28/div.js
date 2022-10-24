import Timer from '../../core/Timer'
import RenderableComponent from './RenderableComponent'

/**
 * TODO: Aquí se mezclan demasiadas cosas, como por ejemplo, la animación
 * y el render.
 */
export default class RenderableSpritesheet extends RenderableComponent {
  /**
   * @type {CanvasImageSource}
   */
  #source
  #width
  #height
  #columns
  #rows
  #currentFrame
  #totalFrames
  #framesPerSecond
  #timer

  constructor({ entity, source, width, height, totalFrames, framesPerSecond = 24 } = {}) {
    super({ entity })
    this.#source = source
    this.#width = width
    this.#height = height
    this.#columns = Math.floor(source.width / width)
    this.#rows = Math.floor(source.height / height)
    this.#currentFrame = 0
    this.#totalFrames = totalFrames
    this.#framesPerSecond = framesPerSecond
    this.#timer = new Timer()
  }

  get columns() {
    return this.#columns
  }

  get rows() {
    return this.#rows
  }

  get source() {
    return this.#source
  }

  get currentFrame() {
    return this.#currentFrame
  }

  set currentFrame(value) {
    this.#currentFrame = value
  }

  get totalFrames() {
    return this.#totalFrames
  }

  get sx() {
    return (this.#currentFrame % this.#columns) * this.#width
  }

  get sy() {
    const row = Math.floor(this.#currentFrame / this.#columns)
    return (row % this.#rows) * this.#height
  }

  get sw() {
    return (this.#width)
  }

  get sh() {
    return (this.#height)
  }

  get progress() {
    return this.#currentFrame / this.#totalFrames
  }

  animate() {
    if (this.#totalFrames > 0 && this.#timer.elapsed(1000 / this.#framesPerSecond)) {
      this.#currentFrame++
      if (this.#currentFrame === this.#totalFrames) {
        this.#currentFrame = 0
        return true
      }
    }
    return false
  }
}
