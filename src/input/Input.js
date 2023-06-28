import Gamepads from './Gamepads'
import Keyboard from './Keyboard'
import Mouse from './Mouse'
import Pointer from './Pointer'
import Touch from './Touch'

export default class Input {
  #bindings
  #state
  #devices
  #keyboard
  #mouse
  #gamepads
  #pointer
  #touch

  constructor({ target, bindings = new Map() } = {}) {
    this.#bindings = bindings
    this.#state = new Map()
    this.#devices = new Map()
    this.#keyboard = new Keyboard()
    this.#mouse = new Mouse(target)
    this.#gamepads = new Gamepads()
    this.#pointer = new Pointer(target)
    this.#touch = new Touch(target)
  }

  get keyboard() {
    return this.#keyboard
  }

  get mouse() {
    return this.#mouse
  }

  get gamepads() {
    return this.#gamepads
  }

  get pointer() {
    return this.#pointer
  }

  get touch() {
    return this.#touch
  }

  /**
   * Actualiza el estado de todos los bindings definidos.
   */
  updateBindings() {
    // Bindings del dispositivo.
    for (const [action] of this.#state) {
      this.#state.set(action, 0)
    }

    for (const [action, binding] of this.#bindings) {
      let value = 0
      for (const [id, path] of binding) {
        if (!this.#devices.has(id)) {
          console.warn(`Device ${id} not found`)
          continue
        }

        const device = this.#devices.get(id)
        if (!device) {
          console.warn(`Device ${id} not initialized`)
          continue
        }

        const currentValue = device.stateOf(path)
        value = Math.max(Math.abs(value), Math.abs(currentValue)) /* * (Math.sign(currentValue) || 1) */
      }
      this.#state.set(action, value)
    }
  }

  stateOf(action) {
    return this.#state.get(action)
  }

  update() {
    this.#gamepads.update()
    this.updateBindings()
  }

  start() {
    if (Touch.isSupported) {
      this.#touch.start()
    }
    this.#mouse.start()
    this.#pointer.start()
    this.#keyboard.start()
    this.#gamepads.start()
    if (Touch.isSupported) {
      this.#devices.set('touch', this.#touch)
    }
    this.#devices.set('mouse', this.#mouse)
    this.#devices.set('pointer', this.#pointer)
    this.#devices.set('keyboard', this.#keyboard)
    this.#devices.set('gamepads', this.#gamepads)
  }

  stop() {
    if (Touch.isSupported) {
      this.#touch.stop()
    }
    this.#mouse.stop()
    this.#pointer.stop()
    this.#keyboard.stop()
    this.#gamepads.stop()
    if (Touch.isSupported) {
      this.#devices.delete('touch', this.#touch)
    }
    this.#devices.delete('mouse', this.#mouse)
    this.#devices.delete('pointer', this.#pointer)
    this.#devices.delete('keyboard', this.#keyboard)
    this.#devices.delete('gamepads', this.#gamepads)
  }
}
