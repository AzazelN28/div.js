export default class Music {
  /**
   * @type {AudioContext}
   */
  #audioContext

  /**
   * @type {Channels}
   */
  #channels

  constructor({ audioContext, channels }) {
    this.#channels = channels
    this.#audioContext = audioContext
  }

  play() {

  }
}
