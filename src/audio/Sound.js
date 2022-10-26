import Channels, { Channel } from './Channels'

/**
 * @typedef {Object} SoundPlayOptions
 * @property {string} [channel='sfx']
 * @property {boolean} [loop=false]
 * @property {number} [loopStart=0]
 * @property {number} [loopEnd=0]
 * @property {number} [detune]
 * @property {number} [playbackRate=1]
 * @property {number} [when]
 * @property {number} [offset]
 * @property {number} [duration]
 */

/**
 * @typedef {Object} SoundConstructorOptions
 * @property {AudioContext} audioContext
 * @property {Channels}
 */

export default class Sound {
  /**
   * Contexto de audio.
   *
   * @type {AudioContext}
   */
  #audioContext

  /**
   * Canales.
   *
   * @type {Channels}
   */
  #channels

  /**
   * Sources que existen ahora mismo.
   *
   * @type {Set<AudioBufferSourceNode>}
   */
  #sources

  /**
   * Constructor
   *
   * @param {SoundConstructorOptions} options
   */
  constructor({ audioContext, channels }) {
    this.#channels = channels
    this.#audioContext = audioContext
    this.#sources = new Set()
  }

  /**
   * @type {AudioContext}
   */
  get audioContext() {
    return this.#audioContext
  }

  /**
   * @type {Channels}
   */
  get channels() {
    return this.#channels
  }

  /**
   * @type {Set<AudioBufferSourceNode>}
   */
  get sources() {
    return this.#sources
  }

  /**
   * Reproduce un sonido puntual a partir de un AudioBuffer
   *
   * @param {AudioBuffer} buffer
   * @param {SoundPlayOptions} options
   * @returns {AudioBufferSourceNode}
   */
  play(
    buffer,
    {
      channel = 'sfx',
      loop,
      loopStart,
      loopEnd,
      detune,
      playbackRate = 1,
      when = this.#audioContext.currentTime,
      offset,
      duration
    } = {}
  ) {
    const source = this.#audioContext.createBufferSource()
    source.onended = () => this.#sources.delete(source)
    source.buffer = buffer
    if (loop) source.loop = loop
    if (loopStart) source.loopStart = loopStart
    if (loopEnd) source.loopEnd = loopEnd
    if (detune) source.detune.value = detune
    if (playbackRate) source.playbackRate.value = playbackRate
    source.start(when, offset, duration)
    if (this.#channels.has(channel)) {
      const { gain } = this.#channels.get(channel)
      source.connect(gain)
    } else {
      throw new Error(`Channel ${channel} doesn't exists`)
    }
    this.#sources.add(source)
    return source
  }
}
