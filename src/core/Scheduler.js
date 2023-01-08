import {
  TaskStateSymbol,
  TaskTypeSymbol,
  TaskSignalSymbol,
  TaskPrioritySymbol,
  TaskIteratorSymbol,
  TaskGeneratorSymbol,
  TaskParentSymbol,
  TaskChildrenSymbol
} from './Task'
import TaskSignal from './TaskSignal'
import TaskState from './TaskState'

/**
 * Scheduler
 */
export default class Scheduler {
  /**
   * Generadores
   *
   * @type {Map<string, Iterator>}
   */
  #generators

  /**
   * Iteradores
   *
   * @type {Map<Task, Iterator>}
   */
  #iterators

  /**
   * Tareas por tipo
   *
   * @type {Map<string, Set<Task>>}
   */
  #tasksByType

  /**
   * Tareas
   *
   * @type {Set<Task>}
   */
  #tasks

  /**
   * Proveedor de tareas
   *
   * @type {TaskProvider}
   */
  #provider

  /**
   * Tareak actual.
   *
   * @type {Task}
   */
  #task

  /**
   * Constructor
   *
   * @param {TaskProvider} provider
   */
  constructor(provider = new TaskProvider()) {
    this.#iterators = new Map()
    this.#tasksByType = new Map()
    this.#generators = new Map()
    this.#tasks = new Set()
    this.#provider = provider
  }

  /**
   *
   * @param {string} type
   */
  unregister(type) {
    this.#generators.delete(type)
    this.#tasksByType.delete(type)
  }

  /**
   * Registra un nuevo generador.
   *
   * @param {string} type
   * @param {Generator<any, any>} generator
   */
  register(type, generator) {
    this.#generators.set(type, generator)
    this.#tasksByType.set(type, new Set())
  }

  /**
   * Obtiene las tareas por tipo.
   *
   * @param {string} type
   * @returns {Set<Task>}
   */
  get(type) {
    return this.#tasksByType.get(type)
  }

  /**
   *
   * @param {*} type
   * @param  {...any} args
   * @returns
   */
  create(type, ...args) {
    const task = this.#provider.allocate()
    const generator = this.#generators.get(type)
    const iterator = generator.call(task, ...args)
    const parent = this.#task

    // Asociamos todos los parámetros necesarios
    // a la tarea.
    task[TaskTypeSymbol] = type
    task[TaskStateSymbol] = TaskState.CREATED
    task[TaskSignalSymbol] = TaskSignal.NONE
    task[TaskPrioritySymbol] = 0
    task[TaskIteratorSymbol] = iterator
    task[TaskGeneratorSymbol] = generator
    task[TaskParentSymbol] = parent
    task[TaskChildrenSymbol].clear()

    // Añadimos la tarea a la lista de hijos del
    // progenitor.
    if (parent) {
      parent[TaskChildrenSymbol].add(task)
    }

    const tasksByType = this.#tasksByType.get(type)
    tasksByType.add(task)

    this.#iterators.set(task, iterator)
    this.#tasks.add(task)

    return task
  }

  /**
   * Actualiza todas las tareas.
   */
  update() {
    const sorted = Array.from(this.#iterators).sort(
      (a, b) => a[TaskPrioritySymbol] - b[TaskPrioritySymbol]
    )
    for (const [task, iterator] of sorted) {
      // Actualizamos los estados de las tareas si las
      // señales están indicadas.
      if (task[TaskSignalSymbol] === TaskSignal.SUSPENDED) {
        task[TaskStateSymbol] = TaskState.SUSPENDED
        task[TaskSignalSymbol] = TaskSignal.NONE
      } else if (task[TaskSignalSymbol] === TaskSignal.RESUMED) {
        task[TaskStateSymbol] = TaskState.RESUMED
        task[TaskSignalSymbol] = TaskSignal.NONE
      } else if (task[TaskSignalSymbol] === TaskSignal.DESTROYED) {
        this.destroy(task)
      }

      // Nos saltamos la tarea que está suspendida.
      if (task.isSuspended || task.isDestroyed) {
        continue
      }

      // Establecemos el iterador al iterador actual.
      this.#task = task

      // Actualizamos el comportamiento de la tarea actual.
      const result = iterator.next()
      task[TaskStateSymbol] = TaskState.UPDATED
      if (result.done) {
        this.destroy(task)
      }
    }
  }

  /**
   * Destruye una tarea.
   *
   * @param {Task} task
   */
  destroy(task) {
    const iterator = task[TaskIteratorSymbol]
    iterator.return()

    task[TaskStateSymbol] = TaskState.DESTROYED
    task.onDestroy()

    const parent = task[TaskParentSymbol]
    if (parent) {
      parent[TaskChildrenSymbol].delete(task)
    }
    task[TaskChildrenSymbol].clear()
    task[TaskParentSymbol] = null

    task[TaskGeneratorSymbol] = null
    task[TaskIteratorSymbol] = null
    task[TaskPrioritySymbol] = 0

    const iterators = this.#tasksByType.get(task[TaskTypeSymbol])
    iterators.delete(task)

    this.#iterators.delete(task)
    this.#tasks.delete(task)

    this.#provider.deallocate(task)
  }
}
