import TransformComponent from '../components/TransformComponent'
import Task from './Task'

export default class Entity extends Task {
  #components = new Map()

  constructor() {
    super()
    this.#components.set('transform', new TransformComponent({ entity: this }))
  }

  /**
   *
   * @param {string} name
   * @param {EntityComponent} component
   */
  set(name, component) {
    component.entity = this
    this.#components.set(name, component)
  }

  has(name) {
    return this.#components.has(name)
  }

  get(name) {
    return this.#components.get(name)
  }

  delete(name) {
    if (!this.#components.has(name)) {
      return false
    }
    const component = this.#components.get(name)
    component.entity = null
    return this.#components.delete(name)
  }

  onCreate() {
    super.onCreate()
    this.#components.forEach((component) => component.onCreate())
  }

  onDestroy() {
    this.#components.forEach((component) => component.onDestroy())
    super.onDestroy()
  }
}
