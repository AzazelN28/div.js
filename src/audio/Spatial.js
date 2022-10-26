import AudioListenerComponent from './components/AudioListenerComponent'
import AudioEmitterComponent, { AudioEmitterState } from './components/AudioEmitterComponent'
import EntityComponentRegistry from '../core/EntityComponentRegistry'
import Channels from './Channels'

export default class Spatial {
  /**
   * Contexto de audio utilizado para crear los
   * nodos y renderizar el audio.
   *
   * @type {AudioContext}
   */
  #audioContext

  /**
   * Canal de audio que utilizará `Spatial`
   * para renderizar el audio.
   *
   * @type {Channel}
   */
  #channels

  /**
   * @type {string}
   */
  #channelName

  /**
   * Mapa de "panners".
   *
   * @type {Map<*,PannerNode>}
   */
  #panners

  /**
   * Mapa de "sources".
   *
   * @type {Map<*,AudioBufferSourceNode>}
   */
  #sources

  /**
   * Registro de componentes de entidad.
   *
   * @type {EntityComponentRegistry}
   */
  #registry

  constructor({ audioContext, channels, channelName, registry }) {
    this.#audioContext = audioContext
    this.#registry = registry
    this.#channels = channels
    this.#channelName = channelName
    this.#panners = new Map()
    this.#sources = new Map()
  }

  /**
   * Actualiza el estado de los nodos de audio
   * a partir de los diferentes componentes.
   */
  update() {
    for (const emitter of this.#registry.get(AudioEmitterComponent)) {
      if (!emitter.entity || !emitter.buffer) continue

      const transform = emitter.entity.get('transform')
      if (!this.#panners.has(emitter)) {
        const panner = this.#audioContext.createPanner()
        panner.distanceModel = emitter.distanceModel
        panner.refDistance = emitter.refDistance
        panner.maxDistance = emitter.maxDistance
        const output = this.#channels.get(this.#channelName)
        panner.connect(output.gain)
        this.#panners.set(emitter, panner)
      }

      const panner = this.#panners.get(emitter)
      if (!this.#sources.has(emitter)) {
        const source = this.#audioContext.createBufferSource()
        source.buffer = emitter.buffer
        source.loop = emitter.loop
        source.loopStart = emitter.loopStart
        source.loopEnd = emitter.loopEnd
        source.connect(panner)
        source.onended = () => {
          source.disconnect()
          this.#sources.delete(emitter)
          emitter.state = AudioEmitterState.ENDED
        }
        this.#sources.set(emitter, source)
      }

      const source = this.#sources.get(emitter)
      if (emitter.start) {
        const when = emitter.when ?? this.#audioContext.currentTime
        const offset = emitter.offset ?? 0
        const duration = emitter.duration ?? emitter.buffer.duration
        source.start(when, offset, duration)
        emitter.state = AudioEmitterState.STARTED
        emitter.start = false
      }

      panner.positionX.value = transform.position.x
      panner.positionY.value = transform.position.y
      panner.positionZ.value = transform.position.z

      panner.orientationX.value = transform.direction.x
      panner.orientationY.value = transform.direction.y
      panner.orientationZ.value = 0
    }

    for (const listener of this.#registry.get(AudioListenerComponent)) {
      if (!listener.entity) continue

      const transform = listener.entity.get('transform')
      if (this.#audioContext.listener.setPosition) {
        this.#audioContext.listener.setPosition(
          transform.position.x,
          transform.position.y,
          transform.position.z
        )
      } else {
        this.#audioContext.listener.positionX.value = transform.position.x
        this.#audioContext.listener.positionY.value = transform.position.y
        this.#audioContext.listener.positionZ.value = transform.position.z
      }

      if (this.#audioContext.listener.setOrientation) {
        this.#audioContext.listener.setOrientation(
          -transform.direction.x,
          -transform.direction.y,
          0,
          0,
          0,
          1
        )
      } else {
        this.#audioContext.listener.forwardX.value = -transform.direction.x
        this.#audioContext.listener.forwardY.value = -transform.direction.y
        this.#audioContext.listener.forwardZ.value = 0

        this.#audioContext.listener.upX.value = 0
        this.#audioContext.listener.upY.value = 0
        this.#audioContext.listener.upZ.value = 1
      }
    }
  }
}
