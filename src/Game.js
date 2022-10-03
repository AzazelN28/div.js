import Core from './core/Core'
import Loop from './core/Loop'
import Process from './core/Process'
import Resize from './canvas/Resize'
import Keyboard from './input/Keyboard'
import Mouse from './input/Mouse'
import Renderer from './renderer/Renderer'
import Gamepads from './input/Gamepads'
import Pool from './core/Pool'
import Sound from './audio/Sound'
import Channels from './audio/Channels'
import Music from './audio/Music'
import FrameCounter from './core/FrameCounter'
import Resources from './core/Resources'

export default class Game {
  /**
   * Input
   */
  #keyboard
  #mouse
  #gamepads

  /**
   * Core
   */
  #loop
  #core
  #pool
  #resources

  /**
   * Video
   */
  #canvas
  #resize
  #renderer
  #frameCounter

  /**
   * Audio
   */
  #sound
  #channels
  #music

  constructor({ canvas, audioContext = new AudioContext() }) {
    const context = canvas.getContext('2d')
    this.#canvas = canvas
    this.#resize = new Resize({ canvas }) // TODO: Cambiarle el nombre a esto por "viewport"
    this.#keyboard = new Keyboard()
    this.#mouse = new Mouse(canvas)
    this.#gamepads = new Gamepads()
    this.#pool = new Pool(2048, Process.create)
    this.#core = new Core(
      () => {
        const process = this.#pool.allocate()
        process.reset()
        return process
      },
      (process) => this.#pool.deallocate(process)
    )
    this.#resources = new Resources()
    this.#frameCounter = new FrameCounter()
    this.#renderer = new Renderer({ context, core: this.#core })
    this.#renderer.debug.push(() => `${this.#frameCounter.framesPerSecond}fps`)
    this.#loop = new Loop({
      pipeline: [
        (time) => this.#frameCounter.update(time),
        () => this.#resize.update(),
        () => this.#gamepads.update(),
        () => this.#core.update(),
        (time) => this.#renderer.render(time),
        (time) => this.#renderer.renderDebug(time)
      ]
    })
    this.#channels = new Channels({ audioContext })
    this.#sound = new Sound({ audioContext, channels: this.#channels })
    this.#music = new Music({ audioContext, channels: this.#channels })
  }

  get keyboard() {
    return this.#keyboard
  }

  get mouse() {
    return this.#mouse
  }

  get resize() {
    return this.#resize
  }

  get core() {
    return this.#core
  }

  get pool() {
    return this.#pool
  }

  get resources() {
    return this.#resources
  }

  get canvas() {
    return this.#canvas
  }

  get resize() {
    return this.#resize
  }

  get renderer() {
    return this.#renderer
  }

  get sound() {
    return this.#sound
  }

  get music() {
    return this.#music
  }

  setMode({ mode, width = undefined, height = undefined, scale = undefined }) {
    this.#resize.mode = mode
    if (Number.isFinite(width)) {
      this.#resize.width = width
    }
    if (Number.isFinite(height)) {
      this.#resize.height = height
    }
    if (Number.isFinite(scale)) {
      this.#resize.scale = scale
    }
    this.#resize.update()
  }

  start() {
    this.#channels.start()
    this.#keyboard.start()
    this.#mouse.start()
    this.#loop.start()
  }

  stop() {
    this.#channels.stop()
    this.#keyboard.stop()
    this.#mouse.stop()
    this.#loop.stop()
  }
}
