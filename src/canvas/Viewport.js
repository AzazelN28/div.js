import { addEventListeners } from '../event/Helper'
import Rect from '../math/Rect'
import Canvas from './Canvas'
import Fullscreen from './Fullscreen'
import ResizeMode from './ResizeMode'

/**
 * @typedef {object} ViewportConstructorOptions
 * @property {HTMLCanvasElement} canvas
 * @property {ResizeMode} [mode=ResizeMode.NONE]
 * @property {number} [scale=1.0]
 * @property {number} [width=320]
 * @property {number} [height=200]
 */

/**
 * Viewport
 */
export default class Viewport {
  /**
   * Canvas en el que pintaremos el juego.
   *
   * @type {HTMLCanvasElement}
   */
  #canvas

  /**
   * Modo en el que reescalaremos el canvas.
   *
   * @type {ResizeMode}
   */
  #mode

  /**
   * Ancho del viewport
   *
   * @type {number}
   */
  #width

  /**
   * Alto del viewport
   */
  #height

  /**
   * Escala del viewport
   *
   * @type {number}
   */
  #scale

  /**
   * Rectángulo del viewport.
   *
   * @type {Rect}
   */
  #rect

  /**
   * Pantalla completa.
   *
   * @type {Fullscreen}
   */
  #fullscreen

  /**
   * Constructor
   *
   * @param {ViewportConstructorOptions} [options={}]
   */
  constructor({ canvas, mode = ResizeMode.NONE, scale = 1.0, width = 320, height = 200 } = {}) {
    this.#canvas = canvas
    this.#mode = mode
    this.#width = width
    this.#height = height
    this.#scale = scale
    this.#rect = new Rect()
    this.#fullscreen = new Fullscreen(canvas)
  }

  /**
   * Pantalla completa.
   *
   * @type {Fullscreen}
   */
  get fullscreen() {
    return this.#fullscreen
  }

  set mode(value) {
    if (![ResizeMode.NONE,ResizeMode.FILL].includes(value)) {
      throw new Error('Invalid resize mode')
    }
    this.#mode = value
  }

  /**
   * @type {ResizeMode}
   */
  get mode() {
    return this.#mode
  }

  set scale(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize scale')
    }
    this.#scale = value
  }

  /**
   * Escala
   *
   * @type {number}
   */
  get scale() {
    return this.#scale
  }

  set width(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize width')
    }
    this.#width = Math.floor(value)
  }

  /**
   * Ancho del viewport.
   *
   * @type {number}
   */
  get width() {
    return this.#width
  }

  set height(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize height')
    }
    this.#height = Math.floor(value)
  }

  /**
   * Alto del viewport.
   *
   * @type {number}
   */
  get height() {
    return this.#height
  }

  /**
   * Rectángulo del viewport.
   *
   * @type {Rect}
   */
  get rect() {
    return this.#rect
  }

  #listener = (e) => {
    if (e.type === 'visibilitychange') {

    } else if (e.type === 'fullscreenerror') {

    }
  }

  /**
   * Actualiza el tamaño del viewport y lo redimensiona
   * si es necesario.
   *
   * @returns {boolean} Si se redimensionó o no.
   */
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
    return resized
  }

  /**
   * Arranca el viewport.
   */
  start() {
    this.#fullscreen.start()
    addEventListeners(document, ['visibilitychange'], this.#listener)
  }

  /**
   * Detiene el viewport.
   */
  stop() {
    this.#fullscreen.stop()
    removeEventListeners(document, ['visibilitychange'], this.#listener)
  }
}
