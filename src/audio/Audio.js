import Channels, { Channel } from './Channels'
import Music from './Music'
import Sound from './Sound'

export default class Audio {
  /**
   * @type {AudioContext}
   */
  #audioContext

  /**
   * @type {Channels}
   */
  #channels

  /**
   * @type {Music}
   */
  #music

  /**
   * @type {Sound}
   */
  #sound

  constructor({ audioContext = new AudioContext() }) {
    this.#audioContext = audioContext
    const channels = this.#channels = new Channels({ audioContext })
    this.#music = new Music({ audioContext, channels })
    this.#sound = new Sound({ audioContext, channels })
  }

  get audioContext() {
    return this.#audioContext
  }

  get channels() {
    return this.#channels
  }

  get music() {
    return this.#music
  }

  get sound() {
    return this.#sound
  }

  start() {
    this.#channels.start()
  }

  stop() {
    this.#channels.stop()
  }
}
