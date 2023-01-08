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

  get type() {
    return this[TaskTypeSymbol]
  }

  set priority(value) {
    if (!Number.isInteger(value) || !Number.isFinite(value)) {
      throw new Error('Invalid task priority')
    }
    this[TaskPrioritySymbol] = value
  }

  get priority() {
    return this[TaskPrioritySymbol]
  }

  get state() {
    return this[TaskStateSymbol]
  }

  get signal() {
    return this[TaskSignalSymbol]
  }

  get isCreated() {
    return this[TaskStateSymbol] === TaskState.CREATED
  }

  get isUpdated() {
    return this[TaskStateSymbol] === TaskState.UPDATED
  }

  get isDestroyed() {
    return this[TaskStateSymbol] === TaskState.DESTROYED
  }

  get isRunning() {
    return [
      TaskState.CREATED,
      TaskState.UPDATED,
      TaskState.RESUMED
    ].includes(
      this[TaskStateSymbol]
    )
  }

  get isSuspended() {
    return this[TaskStateSymbol] === TaskState.SUSPENDED
  }

  get isResumed() {
    return this[TaskStateSymbol] === TaskState.RESUMED
  }

  get parent() {
    return this[TaskParentSymbol]
  }

  isChild(child) {
    return this[TaskChildrenSymbol].has(child)
  }

  suspend(tree) {
    this[TaskSignalSymbol] = TaskSignal.SUSPENDED
    if (tree) {
      for (const child of this[TaskChildrenSymbol]) {
        child.suspend(tree)
      }
    }
    return this
  }

  resume(tree) {
    this[TaskSignalSymbol] = TaskSignal.RESUMED
    if (tree) {
      for (const child of this[TaskChildrenSymbol]) {
        child.resume(tree)
      }
    }
    return this
  }

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
