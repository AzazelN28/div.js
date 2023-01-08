import { addEventListeners, removeEventListeners } from '../event/Helper'

export default class Keyboard {
  /**
   * Estado de las teclas
   *
   * @type {Map<string, boolean>}
   */
  #keys

  /**
   * Elemento objetivo
   *
   * @type {Window|Document|Element}
   */
  #target

  /**
   * Constructor
   *
   * @param {HTMLElement} [target=window]
   */
  constructor(target = window) {
    this.#target = target
    this.#keys = new Map()
  }

  #listener = (e) => {
    this.#keys.set(e.code, e.type === 'keydown')
  }

  reset() {
    this.#keys.clear()
  }

  stateOf([code]) {
    return this.#keys.get(code) ? 1 : 0
  }

  isPressed(code) {
    return this.#keys.get(code) ?? false
  }

  isReleased(code) {
    return !this.isPressed(code)
  }

  start() {
    addEventListeners(this.#target, ['keyup', 'keydown'], this.#listener)
  }

  stop() {
    removeEventListeners(this.#target, ['keyup', 'keydown'], this.#listener)
  }
}
