import EntityComponent from './EntityComponent'
import Task from './Task'

/**
 * Entidad
 */
export default class Entity extends Task {
  /**
   * @type {Map<*, EntityComponent>}
   */
  #components = new Map()

  /**
   * Establece un componente.
   *
   * @param {string} name
   * @param {EntityComponent} component
   */
  set(name, component) {
    component.entity = this
    this.#components.set(name, component)
    return component
  }

  /**
   * Comprueba si existe un componente.
   *
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    return this.#components.has(name)
  }

  /**
   * Devuelve un componente
   *
   * @param {string} name
   * @returns {EntityComponent}
   */
  get(name) {
    return this.#components.get(name)
  }

  /**
   * Borra un componente.
   *
   * @param {string} name
   * @returns {boolean}
   */
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
