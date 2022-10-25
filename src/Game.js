import Loop from './core/Loop'
import Resources from './core/Resources'
import Scheduler from './core/Scheduler'
import FrameCounter from './core/FrameCounter'
import Audio from './audio/Audio'
import Viewport from './canvas/Viewport'
import Input from './input/Input'
import EntityProvider from './core/EntityProvider'
import EntityPoolProvider from './core/EntityPoolProvider'
import EntityComponentRegistry from './core/EntityComponentRegistry'
// import Renderer from './fps/systems/RendererDebug'
import Renderer from './fps/systems/Renderer'
import Collider from './fps/systems/Collider'
import Level from './fps/level/Level'
import Visibility from './fps/systems/Visibility'

export default class Game {
  /**
   * Input
   */
  #input

  /**
   * Core
   */
  #loop
  #scheduler
  #registry
  #resources
  #collider

  /**
   * Video
   */
  #canvas
  #viewport
  #renderer
  #frameCounter

  /**
   * Audio
   */
  #audio

  #visibility
  #level

  constructor({
    canvas,
    bindings = new Map(),
    audioContext = new AudioContext()
  }) {
    this.#level = new Level()
    this.#canvas = canvas
    this.#viewport = new Viewport({ canvas })
    this.#input = new Input({ target: canvas, bindings })
    this.#registry = new EntityComponentRegistry()
    this.#scheduler = new Scheduler(new EntityPoolProvider())
    this.#resources = new Resources()
    this.#frameCounter = new FrameCounter()
    this.#collider = new Collider({
      level: this.#level,
      registry: this.#registry
    })
    this.#renderer = new Renderer({
      canvas,
      level: this.#level,
      registry: this.#registry,
      resources: this.#resources
    })
    this.#visibility = new Visibility({ registry: this.#registry })
    this.#renderer.debug.push(() => `${this.#frameCounter.framesPerSecond}fps`)
    this.#loop = new Loop({
      pipeline: [
        (time) => this.#frameCounter.update(time),
        () => this.#viewport.update(),
        () => this.#input.update(),
        () => this.#collider.update(),
        () => this.#scheduler.update(),
        () => this.#visibility.update(),
        (time) => this.#renderer.render(time),
        (time) => this.#renderer.renderDebug(time)
      ]
    })
    this.#audio = new Audio({ audioContext })
  }

  get input() {
    return this.#input
  }

  get audio() {
    return this.#audio
  }

  get viewport() {
    return this.#viewport
  }

  get collider() {
    return this.#collider
  }

  get scheduler() {
    return this.#scheduler
  }

  get registry() {
    return this.#registry
  }

  get resources() {
    return this.#resources
  }

  get canvas() {
    return this.#canvas
  }

  get viewport() {
    return this.#viewport
  }

  get renderer() {
    return this.#renderer
  }

  get level() {
    return this.#level
  }

  setMode({ mode, width = undefined, height = undefined, scale = undefined }) {
    this.#viewport.mode = mode
    if (Number.isFinite(width)) {
      this.#viewport.width = width
    }
    if (Number.isFinite(height)) {
      this.#viewport.height = height
    }
    if (Number.isFinite(scale)) {
      this.#viewport.scale = scale
    }
    this.#viewport.update()
  }

  start() {
    this.#viewport.start()
    this.#audio.start()
    this.#input.start()
    this.#loop.start()
  }

  stop() {
    this.#viewport.stop()
    this.#audio.stop()
    this.#input.stop()
    this.#loop.stop()
  }
}
