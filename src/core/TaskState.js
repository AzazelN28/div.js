/**
 * Estados de una tarea
 *
 * @enum {number}
 */
export const TaskState = {
  /** La tarea está recién creada (no se ha iterado sobre ella todavía) */
  CREATED: 0,
  /** La tarea ha sido actualizada (iterada) */
  UPDATED: 1,
  /** La tarea ha sido destruida */
  DESTROYED: 2,
  /** La tarea ha sido suspendida */
  SUSPENDED: 3,
  /** La tarea ha sido continuada (pero todavía no se ha iterado sobre ella) */
  RESUMED: 4
}

export default TaskState
