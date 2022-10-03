import { ProcessSignal, ProcessState, SymbolGenerator, SymbolIterator, SymbolSignal, SymbolState } from './Process'

// TODO: Renombrar esto a Scheduler y modificar la forma de crear procesos.
export default class Core {
  #iterators
  #generators
  #processes
  #allocator
  #deallocator

  constructor(allocator, deallocator) {
    this.#iterators = new Map()
    this.#generators = new Map()
    this.#processes = new Set()
    this.#allocator = allocator
    this.#deallocator = deallocator
  }

  get processes() {
    return this.#processes
  }

  get(generator) {
    return Array.from(this.#generators.get(generator)).filter((process) => process[SymbolState] === ProcessState.UPDATED)
  }

  define(
    generator,
    allocator = this.#allocator,
    deallocator = this.#deallocator
  ) {
    this.#generators.set(generator, new Set())
    const processFactory = (...args) => {
      const process = allocator()
      if (!process) {
        return null
      }
      process[SymbolState] = ProcessState.CREATED
      process[SymbolSignal] = null
      process[SymbolGenerator] = generator
      const generatorSet = this.#generators.get(generator)
      generatorSet.add(process)
      const iterator = generator.call(process, ...args)
      process[SymbolIterator] = iterator
      this.#iterators.set(process, iterator)
      this.#processes.add(process)
      return process
    }
    return processFactory
  }

  update() {
    const toDestroy = new Set()
    for (const [process, iterator] of this.#iterators) {
      if (process[SymbolSignal] === ProcessSignal.SLEEP) {
        continue
      }
      const result = iterator.next()
      process[SymbolState] = ProcessState.UPDATED
      if (result.done || process[SymbolSignal] === ProcessSignal.KILL) {
        process[SymbolState] = ProcessState.DESTROYED
        this.destroy(process)
      }
    }
  }

  destroy(process) {
    const generatorSet = this.#generators.get(process[SymbolGenerator])
    generatorSet.delete(process)

    this.#iterators.delete(process)
    this.#processes.delete(process)

    const iterator = process[SymbolIterator]
    iterator.return()

    process[SymbolGenerator] = null
    process[SymbolIterator] = null
    process[SymbolSignal] = null

    this.#deallocator(process)
  }

  kill(process) {
    process[SymbolSignal] = ProcessSignal.KILL
  }
}
