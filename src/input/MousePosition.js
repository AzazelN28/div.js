import Point from '../math/Point'

export class MousePosition {
  /**
   * @type {Point}
   */
  #start

  /**
   * @type {Point}
   */
  #end

  /**
   * @type {Point}
   */
  #current

  /**
   * @type {Point}
   */
  #previous

  /**
   * Constructor
   */
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

export default MousePosition
