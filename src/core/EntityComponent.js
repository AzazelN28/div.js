export default class EntityComponent {
  constructor(entity) {
    this.entity = entity
  }

  onCreate() {}

  onDestroy() {
    this.entity = null
  }
}
