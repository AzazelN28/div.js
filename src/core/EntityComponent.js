/**
 * Componente de la entidad
 */
export default class EntityComponent {
  /**
   * Constructor del componente
   *
   * @param {Entity} entity
   */
  constructor(entity) {
    this.entity = entity
  }

  onCreate() {}

  onDestroy() {
    this.entity = null
  }
}
