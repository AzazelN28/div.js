/**
 * @typedef {Object} ChannelsConstructorOptions
 * @property {AudioContext} audioContext
 * @property {Array<string>} channelNames
 */

/**
 * Canal
 */
export class Channel {
  /**
   * Nombre del canal
   *
   * @type {string}
   */
  #name

  /**
   * Nodo de ganancia.
   *
   * @type {GainNode}
   */
  #gain

  constructor({ name, gain }) {
    this.#name = name
    this.#gain = gain
  }

  get name() {
    return this.#name
  }

  get gain() {
    return this.#gain
  }
}

export default class Channels {
  /**
   * Contexto de audio
   *
   * @type {AudioContext}
   */
  #audioContext

  /**
   * Canales
   *
   * @type {Map<string, GainNode>}
   */
  #channels

  /**
   * Nombres de los canales
   *
   * @type {Array<string>}
   */
  #channelNames

  /**
   * Nodo de ganancia maestro
   *
   * @type {GainNode}
   */
  #master

  /**
   * Constructor
   *
   * @param {ChannelsConstructorOptions} options
   */
  constructor({ audioContext, channelNames = ['music', 'sfx'] }) {
    if (
      !Array.isArray(channelNames) ||
      !channelNames.every((channelName) => typeof channelName === 'string')
    ) {
      throw new Error('Invalid channel names')
    }
    this.#audioContext = audioContext
    this.#channelNames = channelNames
    this.#channels = new Map()
  }

  has(name) {
    return this.#channels.has(name)
  }

  get(name) {
    if (!this.#channels.has(name)) {
      return undefined
    }
    return this.#channels.get(name)
  }

  start() {
    this.#master = this.#audioContext.createGain()
    this.#master.connect(this.#audioContext.destination)

    // Creamos los canales.
    for (const name of this.#channelNames) {
      const gain = this.#audioContext.createGain()
      gain.connect(this.#master)
      this.#channels.set(name, new Channel({ gain, name }))
    }
  }

  stop() {
    this.#master.disconnect()
    this.#channels.forEach((channel) => channel.gain.disconnect())
    this.#channels.clear()
  }
}
