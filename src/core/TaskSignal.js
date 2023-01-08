/**
 * Tipos de señal de tarea
 *
 * @enum {number}
 */
export const TaskSignal = {
  /** Nada */
  NONE: null,
  /** Señal de destrucción */
  DESTROYED: 0,
  /** Señal de suspender */
  SUSPENDED: 1,
  /** Señal de continuar */
  RESUMED: 2
}

export default TaskSignal
