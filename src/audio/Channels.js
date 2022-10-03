export class Channel {
  /**
   * @type {string}
   */
  #name

  /**
   * @type {GainNode}
   */
  #gain

  constructor({ name, gain }) {
    this.#name = name
    this.#gain = gain
  }

  get gain() {
    return this.gain
  }
}

export default class Channels {
  /**
   * @type {AudioContext}
   */
  #audioContext

  /**
   * @type {Map<string, GainNode>}
   */
  #channels

  /**
   * @type {Array<string>}
   */
  #channelNames

  /**
   * @type {GainNode}
   */
  #master

  constructor({ audioContext, channelNames = ['music', 'sfx'] }) {
    if (!Array.isArray(channelNames) || !channelNames.every((channelName) => typeof channelName === 'string')) {
      throw new Error('Invalid channel names')
    }
    this.#audioContext = audioContext
    this.#channelNames = channelNames
    this.#channels = new Map()
  }

  get(name) {
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
