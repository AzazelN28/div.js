/**
 * Proveedor de tareas
 */
export default class TaskProvider {

  /**
   * Devuelve una nueva tarea
   *
   * @returns {Task}
   */
  allocate() {
    return new Task()
  }

  /**
   * Libera una tarea creada
   *
   * @param {Task} task
   * @returns {null}
   */
  deallocate(task) {
    return null
  }
}
