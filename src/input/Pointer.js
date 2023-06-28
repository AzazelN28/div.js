import { addEventListeners, removeEventListeners } from '../event/Helper'
import PointerType from './PointerType'
import PointerPosition from './PointerPosition'
import Vector2 from '../math/Vector2'

export default class Pointer {
  #target
  #buttons
  #position
  #movement
  #isInside
  #type

  /**
   * Constructor
   *
   * @param {HTMLElement|document|window} [target=window]
   */
  constructor(target = window) {
    this.#target = target
    this.#buttons = new Map()
    this.#position = new PointerPosition()
    this.#movement = new Vector2()
    this.#type = PointerType.MOUSE
    this.#isInside = true
  }

  /**
   * Tipo de puntero.
   *
   * @type {PointerType}
   */
  get type() {
    return this.#type
  }

  get position() {
    return this.#position
  }

  get movement() {
    return this.#movement
  }

  get isTouch() {
    return this.#type === PointerType.TOUCH
  }

  get isPen() {
    return this.#type === PointerType.PEN
  }

  get isMouse() {
    return this.#type === PointerType.MOUSE
  }

  /**
   * Devuelve si hay algún elemento bloqueado con el control del puntero.
   *
   * @type {boolean}
   */
  get isLocked() {
    return !!document.pointerLockElement
  }

  /**
   * Devuelve el elemento que está "bloqueando" el control del puntero
   * o `null` si no hay ninguno.
   *
   * @type {Element|null}
   */
  get locked() {
    return document.pointerLockElement
  }

  /**
   * Indica si el puntero está dentro del elemento `target`.
   *
   * @type {boolean}
   */
  get isInside() {
    return this.#isInside
  }

  #listener = (e) => {
    this.#type = e.pointerType
    this.#position.previous.copy(this.#position.current)
    this.#position.current.set(e.offsetX, e.offsetY)
    this.#movement.set(e.movementX, e.movementY)
    if (e.type === 'pointerdown' || e.type === 'pointerup') {
      this.#buttons.set(e.button, e.type === 'pointerdown')
      if (e.type === 'pointerdown') {
        this.#position.start.set(e.offsetX, e.offsetY)
      } else {
        this.#position.end.set(e.offsetX, e.offsetY)
      }
    }
    if (e.type === 'pointerenter') {
      this.#isInside = true
    } else if (e.type === 'pointerleave') {
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

  lock(element = this.#target) {
    element.requestPointerLock()
  }

  unlock() {
    document.exitPointerLock()
  }

  start() {
    addEventListeners(document, ['pointerlockchange', 'pointerlockerror'], this.#listener)
    addEventListeners(
      this.#target,
      ['pointerdown', 'pointerup', 'pointermove', 'pointerenter', 'pointerleave'],
      this.#listener
    )
  }

  stop() {
    removeEventListeners(document, ['pointerlockchange', 'pointerlockerror'], this.#listener)
    removeEventListeners(
      this.#target,
      ['pointerdown', 'pointerup', 'pointermove', 'pointerenter', 'pointerleave'],
      this.#listener
    )
  }
}
