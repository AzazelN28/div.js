/**
 * Número de milisegundos que hay en un segundo.
 *
 * @constant {number}
 */
const SECOND_MS = 1000

/**
 * Contador de fotogramas.
 */
export default class FrameCounter {
  /**
   * Número de fotogramas.
   *
   * @type {number}
   */
  #frameCount

  /**
   * Número de fotogramas por segundo.
   *
   * @type {number}
   */
  #framesPerSecond

  /**
   * Tiempo en el que se empezó a contar.
   *
   * @type {number}
   */
  #startTime

  constructor() {
    this.#startTime = 0
    this.#frameCount = 0
    this.#framesPerSecond = 0
  }

  /**
   * Fotogramas por segundo
   *
   * @type {number}
   */
  get framesPerSecond() {
    return this.#framesPerSecond
  }

  /**
   * Actualiza el contador de fotogramas.
   *
   * @param {number} time
   */
  update(time) {
    this.#frameCount++
    if (time - this.#startTime >= SECOND_MS) {
      this.#startTime = time
      this.#framesPerSecond = this.#frameCount
      this.#frameCount = 0
    }
  }
}
