import { addEventListeners, removeEventListeners } from '../event/Helper'

export default class Fullscreen {
  /**
   * Elemento objetivo
   *
   * @type {HTMLElement}
   */
  #target

  /**
   * Constructor
   *
   * @param {HTMLElement} target
   */
  constructor(target) {
    this.#target = target
  }

  /**
   * Indica si está activo el fullscreen.
   *
   * @type {boolean}
   */
  get isEnabled() {
    return document.fullscreenEnabled
  }

  /**
   *
   */
  get isOn() {
    return !!document.fullscreenElement
  }

  #listener = (e) => {
    if (e.type === 'fullscreenchange') {

    } else if (e.type === 'fullscreenerror') {

    }
  }

  enter(options) {
    return this.#target.requestFullscreen(options)
  }

  exit() {
    return document.exitFullscreen()
  }

  start() {
    addEventListeners(document, ['fullscreenchange'], this.#listener)
  }

  stop() {
    removeEventListeners(document, ['fullscreenchange'], this.#listener)
  }
}
