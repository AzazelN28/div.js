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

  play(buffer, { channel = 'sfx', loop, loopStart, loopEnd, detune, playbackRate = 1, when = this.#audioContext.currentTime, offset, duration } = {}) {
    const bufferSource = this.#audioContext.createBufferSource()
    bufferSource.onended = () => this.#bufferSources.delete(bufferSource)
    bufferSource.buffer = buffer
    bufferSource.loop = loop
    bufferSource.loopStart = loopStart
    bufferSource.loopEnd = loopEnd
    bufferSource.detune = detune
    bufferSource.playbackRate = playbackRate
    bufferSource.start(when, offset, duration)
    bufferSource.connect(this.#channels.get(channel))
    this.#bufferSources.add(bufferSource)
    return bufferSource
  }
}
