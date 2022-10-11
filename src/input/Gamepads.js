import { addEventListeners } from '../event/Helper';

export default class Gamepads {
  /**
   * Lista de gamepads
   *
   * @type {Array<Gamepad>}
   */
  #gamepads

  /**
   * Número de gamepads conectados
   *
   * @type {number}
   */
  #connected

  constructor() {
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

  /**
   * Número de gamepads conectados.
   *
   * @type {number}
   */
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

  stateOf(path) {
    const [index, type, subindex] = path
    if (index < 0 || index >= this.#gamepads.length) {
      throw new Error('Invalid gamepad index')
    }

    const gamepad = this.#gamepads[index]
    if (!gamepad) {
      return 0
    }

    if (type === 'button') {
      return gamepad.buttons[subindex]?.value ?? 0
    } else if (type === 'axis') {
      return gamepad.axes[subindex] ?? 0
    } else {
      throw new Error('Invalid state path')
    }
  }

  start() {
    addEventListeners(window, ['gamepadconnected', 'gamepaddisconnected'], this.#listener)
  }

  stop() {
    removeEventListeners(window, ['gamepadconnected', 'gamepaddisconnected'], this.#listener)
  }
}
