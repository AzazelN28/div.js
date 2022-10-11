import { addEventListeners } from '../event/Helper'
import Rect from '../math/Rect'
import Canvas from './Canvas'
import Fullscreen from './Fullscreen'
import ResizeMode from './ResizeMode'

export default class Viewport {
  #canvas
  #mode
  #width
  #height
  #scale
  #rect
  #fullscreen

  constructor({ canvas, mode = ResizeMode.NONE, scale = 1.0, width = 320, height = 200 } = {}) {
    this.#canvas = canvas
    this.#mode = mode
    this.#width = width
    this.#height = height
    this.#scale = scale
    this.#rect = new Rect()
    this.#fullscreen = new Fullscreen(canvas)
  }

  get fullscreen() {
    return this.#fullscreen
  }

  set mode(value) {
    if (![ResizeMode.NONE,ResizeMode.FILL].includes(value)) {
      throw new Error('Invalid resize mode')
    }
    this.#mode = value
  }

  get mode() {
    return this.#mode
  }

  set scale(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize scale')
    }
    this.#scale = value
  }

  get scale() {
    return this.#scale
  }

  set width(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize width')
    }
    this.#width = Math.floor(value)
  }

  get width() {
    return this.#width
  }

  set height(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize height')
    }
    this.#height = Math.floor(value)
  }

  get height() {
    return this.#height
  }

  get rect() {
    return this.#rect
  }

  #listener = (e) => {
    if (e.type === 'visibilitychange') {

    } else if (e.type === 'fullscreenerror') {

    }
  }

  update() {
    let resized = false
    if (this.#mode === ResizeMode.FILL) {
      resized = Canvas.resizeFill(this.#canvas, this.#scale)
    } else if (this.#mode === ResizeMode.NONE) {
      resized = Canvas.resizeTo(this.#canvas, this.#width, this.#height)
    } else {
      throw new Error('Invalid resize mode')
    }

    if (resized) {
      this.#rect.size.set(this.#canvas.width, this.#canvas.height)
    }
  }

  start() {
    this.#fullscreen.start()
    addEventListeners(document, ['visibilitychange'], this.#listener)
  }

  stop() {
    this.#fullscreen.stop()
    removeEventListeners(document, ['visibilitychange'], this.#listener)
  }
}
