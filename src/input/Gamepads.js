import { addEventListeners } from '../event/Helper'

/**
 * Devuelve el valor indicado si supera el umbral.
 *
 * @param {number} value Valor
 * @param {number} threshold Umbral
 * @returns {number} Valor
 */
export function isActive(value, threshold) {
  if (Math.abs(value) > Math.abs(threshold)
    && Math.sign(value) === Math.sign(threshold)) {
    return value
  }
  return 0
}

/**
 * Gamepads
 */
export default class Gamepads {
  /**
   * Lista de gamepads.
   *
   * @type {Array<Gamepad>}
   */
  #gamepads

  /**
   * Número de gamepads conectados.
   *
   * @type {number}
   */
  #connected

  /**
   * Constructor
   */
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

  /**
   * Actualiza la lista de gamepads.
   */
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

  /**
   * Retorna el estado de cualquier gamepad.
   *
   * @param {Array} path
   * @returns {number}
   */
  stateOfAny(path) {
    const [, type, subindex, threshold] = path
    for (const gamepad of this.#gamepads) {
      if (gamepad && gamepad.connected) {
        if (type === 'button') {
          const value = gamepad.buttons[subindex]?.value ?? 0
          if (isActive(value, threshold)) {
            return value
          }
        } else if (type === 'axis') {
          const value = gamepad.axes[subindex] ?? 0
          if (isActive(value, threshold)) {
            return value
          }
        } else {
          throw new Error('Invalid state path')
        }
      }
    }
    return 0
  }

  /**
   * Retorna el estado de un gamepad específico.
   *
   * @param {Array} path
   * @returns {number}
   */
  stateOf(path) {
    const [index, type, subindex, threshold] = path
    if (typeof index === 'string') {
      if (index === 'any') {
        return this.stateOfAny(path)
      } else {
        throw new Error(`Unknown index ${index}`)
      }
    } else if (typeof index === 'number') {
      if (index < 0 || index >= this.#gamepads.length) {
        throw new Error('Invalid gamepad index')
      }

      const gamepad = this.#gamepads[index]
      if (!gamepad) {
        return 0
      }

      if (type === 'button') {
        const value = gamepad.buttons[subindex]?.value ?? 0
        return isActive(value)
      } else if (type === 'axis') {
        const value = gamepad.axes[subindex] ?? 0
        return isActive(value)
      } else {
        throw new Error('Invalid state path')
      }
    }
  }

  start() {
    addEventListeners(window, ['gamepadconnected', 'gamepaddisconnected'], this.#listener)
  }

  stop() {
    removeEventListeners(window, ['gamepadconnected', 'gamepaddisconnected'], this.#listener)
  }
}
