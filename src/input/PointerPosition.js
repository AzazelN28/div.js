import Vector2 from '../math/Vector2'

export class PointerPosition {
  #start
  #end
  #current
  #previous

  constructor() {
    this.#start = new Vector2()
    this.#end = new Vector2()
    this.#current = new Vector2()
    this.#previous = new Vector2()
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

export default PointerPosition
