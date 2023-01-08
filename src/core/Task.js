import TaskState from './TaskState'
import TaskSignal from './TaskSignal'

export const TaskTypeSymbol = Symbol('task:type')
export const TaskStateSymbol = Symbol('task:state')
export const TaskSignalSymbol = Symbol('task:signal')
export const TaskPrioritySymbol = Symbol('task:priority')
export const TaskIteratorSymbol = Symbol('task:iterator')
export const TaskGeneratorSymbol = Symbol('task:generator')
export const TaskParentSymbol = Symbol('task:parent')
export const TaskChildrenSymbol = Symbol('task:children')

export default class Task {
  constructor() {
    this[TaskTypeSymbol] = null
    this[TaskStateSymbol] = TaskState.CREATED
    this[TaskSignalSymbol] = TaskSignal.NONE
    this[TaskPrioritySymbol] = 0
    this[TaskIteratorSymbol] = null
    this[TaskGeneratorSymbol] = null
    this[TaskParentSymbol] = null
    this[TaskChildrenSymbol] = new Set()
  }

  /**
   * Tipo de tarea
   *
   * @type {string}
   */
  get type() {
    return this[TaskTypeSymbol]
  }

  set priority(value) {
    if (!Number.isInteger(value) || !Number.isFinite(value)) {
      throw new Error('Invalid task priority')
    }
    this[TaskPrioritySymbol] = value
  }

  /**
   * Prioridad
   *
   * @type {number}
   */
  get priority() {
    return this[TaskPrioritySymbol]
  }

  /**
   * Estado en el que se encuentra la tarea.
   *
   * @type {TaskState}
   */
  get state() {
    return this[TaskStateSymbol]
  }

  /**
   * Señal que ha recibido la tarea.
   *
   * @type {TaskSignal}
   */
  get signal() {
    return this[TaskSignalSymbol]
  }

  /**
   * Indica si la tarea está recién creada
   *
   * @type {boolean}
   */
  get isCreated() {
    return this[TaskStateSymbol] === TaskState.CREATED
  }

  /**
   * Indica si la tarea está recién actualizada
   *
   * @type {boolean}
   */
  get isUpdated() {
    return this[TaskStateSymbol] === TaskState.UPDATED
  }

  /**
   * Indica si la tarea está recién destruida
   *
   * @type {boolean}
   */
  get isDestroyed() {
    return this[TaskStateSymbol] === TaskState.DESTROYED
  }

  /**
   * Indica si la tarea está corriendo
   *
   * @type {boolean}
   */
  get isRunning() {
    return [
      TaskState.CREATED,
      TaskState.UPDATED,
      TaskState.RESUMED
    ].includes(
      this[TaskStateSymbol]
    )
  }

  /**
   * Indica si la tarea está recién suspendida
   *
   * @type {boolean}
   */
  get isSuspended() {
    return this[TaskStateSymbol] === TaskState.SUSPENDED
  }

  /**
   * Indica si la tarea está recién continuada
   *
   * @type {boolean}
   */
  get isResumed() {
    return this[TaskStateSymbol] === TaskState.RESUMED
  }

  /**
   * Devuelve la tarea padre de esta tarea. Si es la tarea
   * inicial este valor será `null`.
   *
   * @type {Task|null}
   */
  get parent() {
    return this[TaskParentSymbol]
  }

  /**
   * Devuelve si una tarea es hija de esta.
   *
   * @param {Task} child
   * @returns {boolean}
   */
  hasChild(child) {
    return this[TaskChildrenSymbol].has(child)
  }

  /**
   * Suspende la tarea
   *
   * @param {boolean} [tree=false] Indica si debe suspender todo el árbol de tareas
   * @returns {Task}
   */
  suspend(tree) {
    this[TaskSignalSymbol] = TaskSignal.SUSPENDED
    if (tree) {
      for (const child of this[TaskChildrenSymbol]) {
        child.suspend(tree)
      }
    }
    return this
  }

  /**
   * Continua con la tarea
   *
   * @param {boolean} [tree=false] Indica si debe continuar todo el árbol de tareas
   * @returns {Task}
   */
  resume(tree) {
    this[TaskSignalSymbol] = TaskSignal.RESUMED
    if (tree) {
      for (const child of this[TaskChildrenSymbol]) {
        child.resume(tree)
      }
    }
    return this
  }

  /**
   * Destruye la tarea
   *
   * @returns {Task}
   */
  destroy() {
    this[TaskSignalSymbol] = TaskSignal.DESTROYED
    return this
  }

  onCreate() {
    // TODO:
  }

  onDestroy() {
    // TODO:
  }
}
