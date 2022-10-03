import { addEventListeners } from '../event/Helper';

export default class Gamepads {
  #target
  #gamepads
  #connected

  constructor(target = window) {
    this.#target = target
    this.#gamepads = null
    this.#connected = 0
  }

  #listener = (e) => {
    if (e.type === 'gamepadconnected') {
      // connected
    } else {
      // disconnected
    }
  }

  get connected() {
    return this.#connected
  }

  update() {
    this.#gamepads = navigator.getGamepads()
    this.#connected = 0
    if (this.#gamepads) {
      for (const gamepad of this.#gamepads) {
        if (gamepad && gamepad.connected) {
          this.#connected++
        }
      }
    }
  }

  start() {
    addEventListeners(this.#target, ['gamepadconnected', 'gamepaddisconnected'], this.#listener)
  }

  stop() {
    removeEventListeners(this.#target, ['gamepadconnected', 'gamepaddisconnected'], this.#listener)
  }
}
