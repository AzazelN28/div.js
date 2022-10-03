export default class Music {
  /**
   * @type {AudioContext}
   */
  #audioContext

  constructor({ audioContext }) {
    this.#audioContext = audioContext
  }

  play() {

  }
}
