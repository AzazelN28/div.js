class PoolRef {
  #object
  #isAllocated

  constructor(object) {
    this.#object = object
    this.#isAllocated = false
  }

  get object() {
    return this.#object
  }

  get isAllocated() {
    return this.#isAllocated
  }

  get isFree() {
    return !this.#isAllocated
  }

  allocate() {
    this.#isAllocated = true
    return this.#object
  }

  free() {
    this.#isAllocated = false
  }
}

export default class Pool {
  #size
  #index
  #indices
  #refs
  #count

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

  get index() {
    return this.#index
  }

  get size() {
    return this.#size
  }

  get available() {
    return this.#size - this.#count
  }

  get count() {
    return this.#count
  }

  #next() {
    this.#index++
    if (this.#index >= this.#size) {
      this.#index = 0
    }
  }

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
