export class MusicTrack {
  /**
   * @type {AudioContext}
   */
  #audioContext

  /**
   * @type {Channel}
   */
  #channel

  /**
   * @type {AudioBuffer}
   */
  #buffer

  /**
   * @type {AudioBufferSourceNode}
   */
  #source

  /**
   * @type {GainNode}
   */
  #gain

  constructor({ audioContext, channel, buffer }) {
    this.#audioContext = audioContext
    this.#channel = channel
    this.#buffer = buffer
    this.#source = null
    this.#gain = null
  }

  fadeIn(time = 10) {
    const gain = this.#audioContext.createGain()
    gain.connect(this.#channel.gain)
    // Empezamos a reproducir el sonido desde 0 y vamos aumentando hasta
    // llegar al máximo.
    gain.gain.setValueAtTime(0, this.#audioContext.currentTime)
    gain.gain.linearRampToValueAtTime(1, this.#audioContext.currentTime + time)

    const source = this.#audioContext.createBufferSource()
    source.buffer = this.#buffer
    source.loop = true
    source.connect(gain)
    source.start(this.#audioContext.currentTime)
    source.onended = () => {
      source.disconnect()
      gain.disconnect()
      this.#source = null
      this.#gain = null
      this.#buffer = null
      this.#audioContext = null
      this.#channel = null
    }

    this.#gain = gain
    this.#source = source
  }

  fadeOut(time = 10) {
    const gain = this.#gain
    const source = this.#source
    const endTime = this.#audioContext.currentTime + time
    gain.gain.linearRampToValueAtTime(0, endTime)
    source.stop(endTime)
  }
}

export default class Music {
  /**
   * Contexto de Audio
   *
   * @type {AudioContext}
   */
  #audioContext

  /**
   * Canales de salida
   *
   * @type {Channels}
   */
  #channels

  /**
   * Nombre del canal.
   *
   * @type {string}
   */
  #channelName

  /**
   * Pista actual.
   *
   * @type {MusicTrack}
   */
  #currentTrack = null

  /**
   * Constructor
   *
   * @param {MusicConstructorOptions} options
   */
  constructor({ audioContext, channels, channelName }) {
    this.#channels = channels
    this.#channelName = channelName
    this.#audioContext = audioContext
    this.#currentTrack = null
  }

  play(buffer) {
    if (!this.#currentTrack) {
      this.#currentTrack = new MusicTrack({
        audioContext: this.#audioContext,
        channel: this.#channels.get(this.#channelName),
        buffer
      })
      this.#currentTrack.fadeIn()
    } else {
      this.#currentTrack.fadeOut()
      this.#currentTrack = new MusicTrack({
        audioContext: this.#audioContext,
        channel: this.#channels.get(this.#channelName),
        buffer
      })
      this.#currentTrack.fadeIn()
    }
  }
}
