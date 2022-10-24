import EntityComponent from '../../core/EntityComponent'

export default class TransformComponent extends EntityComponent {
  constructor({ entity, position, rotation, scale }) {
    super(entity)
    this.position = position
    this.rotation = rotation
    this.scale = scale
  }
}
