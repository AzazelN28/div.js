/**
 * Referencia a un objeto.
 */
class PoolRef {
  /**
   * Referencia.
   *
   * @type {object}
   */
  #object

  /**
   * Indica si el objeto ha sido reservado.
   *
   * @type {boolean}
   */
  #isAllocated

  /**
   * Constructor
   *
   * @param {object} object
   */
  constructor(object) {
    this.#object = object
    this.#isAllocated = false
  }

  /**
   * Referencia almacenada.
   *
   * @type {object}
   */
  get object() {
    return this.#object
  }

  /**
   * Indica si ha sido reservado.
   *
   * @type {boolean}
   */
  get isAllocated() {
    return this.#isAllocated
  }

  /**
   * Indica si ha sido liberado.
   *
   * @type {boolean}
   */
  get isFree() {
    return !this.#isAllocated
  }

  /**
   * Reserva el objeto.
   *
   * @returns {object}
   */
  allocate() {
    this.#isAllocated = true
    return this.#object
  }

  /**
   * Libera el objeto.
   */
  free() {
    this.#isAllocated = false
  }
}

/**
 * Pool de objetos.
 */
export default class Pool {
  /**
   * Tamaño del pool.
   *
   * @type {number}
   */
  #size

  /**
   * Índice actual del pool.
   *
   * @type {number}
   */
  #index

  /**
   * Mapa de objetos a índices.
   *
   * @type {Map<object, number>}
   */
  #indices

  /**
   * Referencias a objetos.
   *
   * @type {Array<PoolRef>}
   */
  #refs

  /**
   * Número de objetos reservados
   *
   * @type {number}
   */
  #count

  /**
   * Constructor
   *
   * @param {number} size
   * @param {Function} factory
   */
  constructor(size, factory) {
    this.#size = size
    this.#count = 0
    this.#index = 0
    this.#refs = []
    this.#indices = new Map()
    for (let index = 0; index < size; index++) {
      const object = factory(index, size)
      const ref = new PoolRef(object)
      this.#refs.push(ref)
      this.#indices.set(object, index)
    }
  }

  /**
   * Índice actual.
   *
   * @type {number}
   */
  get index() {
    return this.#index
  }

  /**
   * Tamaño del pool
   *
   * @type {number}
   */
  get size() {
    return this.#size
  }

  /**
   * Objetos disponibles.
   *
   * @type {number}
   */
  get available() {
    return this.#size - this.#count
  }

  /**
   * Objetos reservados.
   *
   * @type {number}
   */
  get count() {
    return this.#count
  }

  /**
   * Itera sobre el pool.
   */
  #next() {
    this.#index++
    if (this.#index >= this.#size) {
      this.#index = 0
    }
  }

  /**
   * Reserva un objeto.
   *
   * @returns {object}
   */
  allocate() {
    let start = this.#index
    do {
      const ref = this.#refs[this.#index]
      if (ref.isFree) {
        this.#next()
        this.#count++
        return ref.allocate()
      }
      this.#next()
    } while (start !== this.#index)
    return null
  }

  /**
   * Libera un objeto.
   *
   * @param {object} object
   * @returns {boolean}
   */
  deallocate(object) {
    const index = this.#indices.get(object)
    const ref = this.#refs[index]
    if (ref.isAllocated) {
      this.#count--
      this.#index = index
      ref.free()
      return true
    }
    return false
  }
}
