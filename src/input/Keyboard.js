import { addEventListeners, removeEventListeners } from '../event/Helper'

export default class Keyboard {
  /**
   * Estado de las teclas
   *
   * @type {Map<string, boolean>}
   */
  #keys

  /**
   *
   *
   * @type {Window|Document|Element}
   */
  #target

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
