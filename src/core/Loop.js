/**
 * @typedef {function} AnimationFrameRequestFunction
 */

/**
 * @typedef {function} AnimationFrameCancelFunction
 */

/**
 * @typedef {object} AnimationFrame
 * @property {AnimationFrameRequestFunction} request Solicita un nuevo fotograma
 * @property {AnimationFrameCancelFunction} cancel Cancela el fotograma actual
 */

/**
 * @typedef {object} LoopConstructorOptions
 * @property {Array<Function>} [pipeline=[]]
 * @property {Array<any>} [args=[]]
 * @property {Function} [requestAnimationFrame=window.requestAnimationFrame]
 * @property {Function} [cancelAnimationFrame=window.cancelAnimationFrame]
 */

/**
 * Bucle con pipeline.
 */
export default class Loop {
  /**
   * Identificador del fotograma actual
   *
   * @type {any}
   */
  #id

  /**
   * Indica si está corriendo el bucle o no.
   *
   * @type {boolean}
   */
  #isRunning

  /**
   * Argumentos que se le pasarán a las funciones del pipeline.
   *
   * @type {Array<any>}
   */
  #args

  /**
   * Pipeline.
   *
   * @type {Array<Function>}
   */
  #pipeline

  /**
   * Funciones usadas para controlar los fotogramas.
   *
   * @type {AnimationFrame}
   */
  #animationFrame

  /**
   * Constructor
   *
   * @param {LoopConstructorOptions} [options={}]
   */
  constructor({
    pipeline = [],
    args = [],
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame
  } = {}) {
    this.#id = null
    this.#isRunning = false
    this.#args = args ?? []
    this.#pipeline = pipeline ?? []
    this.#animationFrame = {
      request: requestAnimationFrame ?? window.requestAnimationFrame,
      cancel: cancelAnimationFrame ?? window.cancelAnimationFrame
    }
  }

  /**
   * Indica si está corriendo.
   *
   * @type {boolean}
   */
  get isRunning() {
    return this.#isRunning
  }

  /**
   * Objeto o identificador actual de llamar a `animationFrame`
   *
   * @type {any}
   */
  get id() {
    return this.#id
  }

  /**
   * Pipeline
   *
   * @type {Array<Function>}
   */
  get pipeline() {
    return this.#pipeline
  }

  /**
   * Este listener es encolado usando las funciones de `animationFrame.request`
   * y llamará a todo el `pipeline` que hayamos definido.
   *
   * @param {number} time
   */
  #listener = (time) => {
    this.#pipeline.forEach((step) => step(time, ...this.#args))
    this.#id = this.#animationFrame.request.call(window, this.#listener)
  }

  /**
   * Arranca el bucle.
   *
   * @returns {boolean}
   */
  start() {
    if (this.#isRunning) {
      return false
    }
    this.#id = this.#animationFrame.request.call(window, this.#listener)
    this.#isRunning = true
    return true
  }

  /**
   * Detiene el bucle.
   *
   * @returns {boolean}
   */
  stop() {
    if (!this.#isRunning) {
      return false
    }
    this.#animationFrame.cancel(this.#id)
    this.#id = null
    this.#isRunning = false
    return true
  }
}
