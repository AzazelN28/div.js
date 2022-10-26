import Channels from './Channels'
import Music from './Music'
import Sound from './Sound'
import Spatial from './Spatial'

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

  /**
   * Controla el sistema de audio "espacial"
   *
   * @type {Spatial}
   */
  #spatial

  constructor({ audioContext = new AudioContext(), registry }) {
    this.#audioContext = audioContext
    this.#channels = new Channels({ audioContext })
    this.#music = new Music({ audioContext, channels: this.#channels, channelName: 'music' })
    this.#sound = new Sound({ audioContext, channels: this.#channels })
    this.#spatial = new Spatial({ audioContext, channels: this.#channels, channelName: 'sfx', registry })
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

  update() {
    this.#spatial.update()
  }
}
