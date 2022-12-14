import { addEventListeners, removeEventListeners } from '../event/Helper'
import Point from '../math/Point'

export class MousePosition {
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

export default class Mouse {
  #target
  #buttons
  #position
  #movement
  #isInside

  constructor(target = window) {
    this.#target = target
    this.#buttons = new Map()
    this.#position = new MousePosition()
    this.#movement = new Point()
    this.#isInside = true
  }

  get position() {
    return this.#position
  }

  get movement() {
    return this.#movement
  }

  get isInside() {
    return this.#isInside
  }

  #listener = (e) => {
    this.#position.previous.copy(this.#position.current)
    this.#position.current.set(e.offsetX, e.offsetY)
    this.#movement.set(e.movementX, e.movementY)
    if (e.type === 'mousedown' || e.type === 'mouseup') {
      this.#buttons.set(e.button, e.type === 'mousedown')
      if (e.type === 'mousedown') {
        this.#position.start.set(e.offsetX, e.offsetY)
      } else {
        this.#position.end.set(e.offsetX, e.offsetY)
      }
    }
    if (e.type === 'mouseenter') {
      this.#isInside = true
    } else if (e.type === 'mouseleave') {
      this.#isInside = false
    }
  }

  stateOf([button]) {
    return this.#buttons.get(button) ? 1 : 0
  }

  isPressed(button) {
    return this.#buttons.get(button) ?? false
  }

  isReleased(button) {
    return !this.isPressed(button)
  }

  start() {
    addEventListeners(this.#target, ['mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'], this.#listener)
  }

  stop() {
    removeEventListeners(this.#target, ['mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'], this.#listener)
  }
}
