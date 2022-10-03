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

  get framesPerSecond() {
    return this.#framesPerSecond
  }

  update(time) {
    this.#frameCount++
    if (time - this.#startTime >= 1000) {
      this.#startTime = time
      this.#framesPerSecond = this.#frameCount
      this.#frameCount = 0
    }
  }
}
