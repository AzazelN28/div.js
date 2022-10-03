import Timer from '../core/Timer'

/**
 * TODO: Aquí se mezclan demasiadas cosas, como por ejemplo, la animación
 * y el render.
 */
export default class RenderableSpritesheet {
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

  constructor({ source, width, height, totalFrames, framesPerSecond = 24 }) {
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
    return Math.floor(this.#currentFrame / this.#columns) * this.#height
  }

  get sw() {
    return (this.#width)
  }

  get sh() {
    return (this.#height)
  }

  animate() {
    if (this.#totalFrames > 0 && this.#timer.time >= 1000 / this.#framesPerSecond) {
      this.#currentFrame = (this.#currentFrame + 1) % this.#totalFrames
      this.#timer.reset()
    }
  }
}
