import Entity from './Entity'

export default class EntityProvider {
  allocate() {
    return new Entity()
  }

  deallocate(entity) {
    return null
  }
}
