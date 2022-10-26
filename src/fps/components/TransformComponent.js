import EntityComponent from '../../core/EntityComponent'
import Vector2 from '../../math/Vector2'
import Vector3 from '../../math/Vector3'

export default class TransformComponent extends EntityComponent {
  constructor({ entity, position = new Vector3(0, 0, 0), rotation = 0, scale = new Vector3(1, 1, 1), direction = new Vector2() } = {}) {
    super(entity)
    /**
     * Coordenadas de la entidad en el espacio 3D
     * del nivel. Donde x e y indican las coordenadas
     * sobre el plano del suelo y la z es la altura.
     *
     * @type {Vector3}
     */
    this.position = position
    /**
     * Rotación de la entidad, indicada en radianes.
     *
     * @type {number}
     */
    this.rotation = rotation
    /**
     * Dirección de la entidad.
     *
     * @type {Vector2}
     */
    this.direction = direction
    /**
     * Escala de la entidad.
     *
     * @type {Vector3}
     */
    this.scale = scale
  }
}
