import EntityComponent from '../core/EntityComponent'

export default class AudioListenerComponent extends EntityComponent {
  /**
   * @type {GainNode}
   */
  #gain

  /**
   * @type {PannerNode}
   */
  #panner

  /**
   * @type {AudioBufferSourceNode}
   */
  #source

  constructor({ audioContext }) {
    this.#audioContext = audioContext

    this.#gain = audioContext.createGain()
    this.#gain.connect(audioContext.destination)

    this.#panner = audioContext.createPanner()
    // Configuramos las movidas del audio.
    this.#panner.connect(this.#gain)

    this.#source = audioContext.createBufferSource()
    this.#source.buffer = buffer
    this.#source.loop = true
    this.#source.connect(this.#panner)
    this.#source.start()

    this.#panner.distanceModel = 'linear'
    this.#panner.refDistance = 64
    this.#panner.maxDistance = 128
  }

  get gain() {
    return this.#gain
  }

  get panner() {
    return this.#panner
  }

  get source() {
    return this.#source
  }
}
