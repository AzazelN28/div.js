import Entity from './Entity'
import Pool from './Pool'

/**
 * Proveedor de entidades usando un "pool"
 * de entidades de tamaño fijo. Esto es especialmente
 * útil para no tener que estar reservando/liberando
 * memoria continuamente.
 */
export default class EntityPoolProvider {
  /**
   * @type {Pool<Entity>}
   */
  #pool

  /**
   * Constructor
   *
   * @param {number} [size=2048] Tamaño del pool
   */
  constructor(size = 2048) {
    this.#pool = new Pool(size, () => new Entity())
  }

  /**
   * Reserva una nueva entidad.
   *
   * @returns {Entity|null}
   */
  allocate() {
    return this.#pool.allocate()
  }

  /**
   * Libera una entidad reservada.
   *
   * @param {Entity} entity
   * @returns {boolean}
   */
  deallocate(entity) {
    return this.#pool.deallocate(entity)
  }
}
