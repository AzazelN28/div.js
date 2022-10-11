import { addEventListeners, removeEventListeners } from '../event/Helper'

export default class Fullscreen {
  #target

  constructor(target) {
    this.#target = target
  }

  get isEnabled() {
    return document.fullscreenEnabled
  }

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
