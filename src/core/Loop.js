export default class Loop {
  #id
  #isRunning
  #args
  #pipeline
  #animationFrame

  constructor({
    pipeline = [],
    args = [],
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame
  } = {}) {
    this.#id = null
    this.#isRunning = false
    this.#args = args ?? []
    this.#pipeline = pipeline ?? []
    this.#animationFrame = {
      request: requestAnimationFrame ?? window.requestAnimationFrame,
      cancel: cancelAnimationFrame ?? window.cancelAnimationFrame
    }
  }

  get isRunning() {
    return this.#isRunning
  }

  get id() {
    return this.#id
  }

  get pipeline() {
    return this.#pipeline
  }

  #listener = (time) => {
    this.#pipeline.forEach((step) => step(time, ...this.#args))
    this.#id = this.#animationFrame.request.call(window, this.#listener)
  }

  start() {
    if (this.#isRunning) {
      return false
    }
    this.#id = this.#animationFrame.request.call(window, this.#listener)
    this.#isRunning = true
    return true
  }

  stop() {
    if (!this.#isRunning) {
      return false
    }
    this.#animationFrame.cancel(this.#id)
    this.#id = null
    this.#isRunning = false
    return true
  }
}
