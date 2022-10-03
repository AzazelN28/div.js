export default class Timer {
  #startTime

  constructor() {
    this.#startTime = Date.now()
  }

  get time() {
    return Date.now() - this.#startTime
  }

  elapsed(time) {
    if (this.time < time) {
      return false
    }
    this.reset()
    return true
  }

  reset() {
    this.#startTime = Date.now()
  }
}
