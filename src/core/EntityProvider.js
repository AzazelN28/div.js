import Entity from './Entity'

/**
 * Proveedor de entidades.
 */
export default class EntityProvider {
  allocate() {
    return new Entity()
  }

  deallocate(entity) {
    return null
  }
}
