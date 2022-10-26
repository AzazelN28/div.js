import EntityComponent from '../../core/EntityComponent'

/**
 * Modelo de distancia.
 *
 * @readonly
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PannerNode/distanceModel
 */
export const AudioEmitterDistanceModel = {
  LINEAR: 'linear', // linear: A linear distance model calculating the gain induced by the distance according to: 1 - rolloffFactor * (distance - refDistance) / (maxDistance - refDistance)
  INVERSE: 'inverse', // inverse: An inverse distance model calculating the gain induced by the distance according to: refDistance / (refDistance + rolloffFactor * (Math.max(distance, refDistance) - refDistance))
  EXPONENTIAL: 'exponential' // exponential: An exponential distance model calculating the gain induced by the distance according to: pow((Math.max(distance, refDistance) / refDistance, -rolloffFactor).
}

/**
 * Modelo de paneo.
 *
 * @readonly
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PannerNode/panningModel
 */
export const AudioEmitterPanningModel = {
  EQUALPOWER: 'equalpower'
}

/**
 * @readonly
 * @enum {string}
 */
export const AudioEmitterState = {
  /** El sonido está listo para reproducirse */
  READY: 'ready',
  /** El sonido comenzó a reproducirse */
  STARTED: 'started',
  /** El sonido terminó de reproducirse */
  ENDED: 'ended'
}

export default class AudioEmitterComponent extends EntityComponent {
  constructor({ entity, buffer, start = false, loop = false, loopStart = 0, loopEnd = 0, when = 0, offset = 0, duration = buffer?.duration ?? Infinity, distanceModel = AudioEmitterDistanceModel.LINEAR, refDistance = 64, maxDistance = 128 } = {}) {
    super(entity)
    /**
     * Indica el buffer de audio que vamos a utilizar
     * para reproducir el sonido.
     *
     * @type {AudioBuffer}
     */
    this.buffer = buffer
    /**
     * Indica si el audio debe comenzar inmediatamente.
     *
     * @type {boolean}
     */
    this.start = start
    /**
     * Indica si el audio debe reproducirse en bucle.
     * Por defecto es `false`
     *
     * @type {boolean}
     */
    this.loop = loop
    /**
     * Indica dónde debe comenzar el bucle en el buffer
     * de audio. Por defecto es `0`
     *
     * @type {number}
     */
    this.loopStart = loopStart
    /**
     * Indica dónde debe terminar el bucle en el buffer
     * de audio. Por defecto es `0`.
     *
     * @type {number}
     */
    this.loopEnd = loopEnd

    /**
     * Cuándo debe reproducirse el sonido. Esto sirve
     * para retrasar la reproducción del sonido tanto
     * tiempo como sea necesario.
     *
     * @type {number}
     */
    this.when = when

    /**
     * Offset dentro del buffer de audio.
     *
     * @type {number}
     */
    this.offset = offset
    /**
     * Duración del sonido.
     *
     * @type {number}
     */
    this.duration = duration
    /**
     * Estado en el que se encuentra la reproducción del sonido.
     *
     * ¡IMPORTANTE! Este valor sólo debería ser modificado por el sistema
     * de audio, nunca por el usuario.
     *
     * @readonly
     * @type {AudioEmitterState}
     */
    this.state = AudioEmitterState.READY
    /**
     * Modelo de distancia.
     *
     * @type {string}
     */
    this.distanceModel = distanceModel
    /**
     * Distancia de referencia. Por defecto 64
     *
     * @type {number}
     */
    this.refDistance = refDistance
    /**
     * Distancia máxima. Por defecto 128
     *
     * @type {number}
     */
    this.maxDistance = maxDistance
  }
}
