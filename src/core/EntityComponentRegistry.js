export default class EntityComponentRegistry {
  #byConstructor = new Map()

  anyOf(...constructors) {
    const list = new Array()
    for (const constructor of constructors) {
      const components = this.get(constructor)
      list.push(...components)
    }
    return new Set(list)
  }

  get(constructor) {
    if (!this.#byConstructor.has(constructor)) {
      return new Set()
    }
    const components = this.#byConstructor.get(constructor)
    return components
  }

  create(constructor, ...args) {
    const component = new constructor(...args)
    this.register(component)
    return component
  }

  destroy(component) {
    component.entity = null
    this.unregister(component)
  }

  register(component) {
    if (!this.#byConstructor.has(component.constructor)) {
      this.#byConstructor.set(component.constructor, new Set())
    }
    const components = this.#byConstructor.get(component.constructor)
    return components.add(component)
  }

  unregister(component) {
    if (!this.#byConstructor.has(component.constructor)) {
      throw new Error(`Constructor ${component.constructor} wasn't registered`)
    }
    const components = this.#byConstructor.get(component.constructor)
    return components.delete(component)
  }
}
