/**
 * Temporizador.
 *
 * NOTA: ¿Debería poder pasar la fuente del tiempo?
 */
export default class Timer {
  /**
   * Momento en el que se inició.
   *
   * @type {number}
   */
  #startTime

  /**
   * Constructor
   *
   * @param {number} [startTime=Date.now()]
   */
  constructor(startTime = Date.now()) {
    this.#startTime = startTime
  }

  /**
   * Devuelve el tipo transcurrido.
   *
   * @type {number}
   */
  get time() {
    return Date.now() - this.#startTime
  }

  /**
   * Devuelve `true` si el tiempo pasado como parámetro
   * ha transcurrido.
   *
   * @param {number} time
   * @returns {boolean}
   */
  elapsed(time) {
    if (this.time < time) {
      return false
    }
    this.reset()
    return true
  }

  /**
   * Reinicia el temporizador.
   */
  reset() {
    this.#startTime = Date.now()
  }
}
