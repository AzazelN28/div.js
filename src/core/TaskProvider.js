export default class TaskProvider {
  allocate() {
    return new Task()
  }

  deallocate(task) {
    return null
  }
}
