import Entity from './Entity'
import Pool from './Pool'

export default class EntityPoolProvider {
  /**
   * @type {Pool<Entity>}
   */
  #pool

  constructor(size = 2048) {
    this.#pool = new Pool(size, () => new Entity())
  }

  allocate() {
    return this.#pool.allocate()
  }

  deallocate(entity) {
    return this.#pool.deallocate(entity)
  }
}
