import { addEventListeners, removeEventListeners } from '../event/Helper'
import Point from '../math/Point'

export class TouchPosition {
  #start
  #end
  #current
  #previous

  constructor() {
    this.#start = new Point()
    this.#end = new Point()
    this.#current = new Point()
    this.#previous = new Point()
  }

  get start() {
    return this.#start
  }

  get end() {
    return this.#end
  }

  get current() {
    return this.#current
  }

  get previous() {
    return this.#previous
  }
}
export default class Touch {
  #target

  /**
   * Devuelve si los eventos de Touch están soportados.
   *
   * @returns {boolean}
   */
  static isSupported() {
    return navigator.maxTouchPoints > 0
  }

  constructor(target) {
    this.#target = target
  }

  // TODO: Se podría simular un gamepad en pantalla pero creo que eso debería ser
  // otra clase completamente distinta.

  // TODO: Devolverá la rotación de los dedos (cuando haya más de un dedo) en caso contrario devolverá 0
  get rotation() {

  }

  // TODO: Devolverá la escala diferencia entre distancias de los dedos.
  get scale() {

  }

  #listener = (e) => {
    if (e.type === 'touchstart') {

    } else if (e.type === 'touchend' || e.type === 'touchcancel') {

    }
  }

  start() {
    addEventListeners(
      this.#target,
      [
        'touchstart',
        'touchend',
        'touchcancel',
        'touchmove'
      ],
      this.#listener
    )
  }

  stop() {
    removeEventListeners(
      this.#target,
      [
        'touchstart',
        'touchend',
        'touchcancel',
        'touchmove'
      ],
      this.#listener
    )
  }
}
