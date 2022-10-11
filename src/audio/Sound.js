export default class Sound {
  /**
   * @type {AudioContext}
   */
  #audioContext

  /**
   * @type {Channels}
   */
  #channels

  /**
   * @type {Set<BufferSource>}
   */
  #bufferSources

  constructor({ audioContext, channels }) {
    this.#channels = channels
    this.#audioContext = audioContext
    this.#bufferSources = new Set()
  }

  get audioContext() {
    return this.#audioContext
  }

  get channels() {
    return this.#channels
  }

  get bufferSources() {
    return this.#bufferSources
  }

  play(buffer, { channel = 'sfx', loop, loopStart, loopEnd, detune, playbackRate = 1, when = this.#audioContext.currentTime, offset, duration } = {}) {
    const bufferSource = this.#audioContext.createBufferSource()
    bufferSource.onended = () => this.#bufferSources.delete(bufferSource)
    bufferSource.buffer = buffer
    if (loop) bufferSource.loop = loop
    if (loopStart) bufferSource.loopStart = loopStart
    if (loopEnd) bufferSource.loopEnd = loopEnd
    if (detune) bufferSource.detune.value = detune
    if (playbackRate) bufferSource.playbackRate.value = playbackRate
    bufferSource.start(when, offset, duration)
    if (this.#channels.has(channel)) {
      const { gain } = this.#channels.get(channel)
      bufferSource.connect(gain)
    } else {
      throw new Error(`Channel ${channel} doesn't exists`)
    }
    this.#bufferSources.add(bufferSource)
    return bufferSource
  }
}
