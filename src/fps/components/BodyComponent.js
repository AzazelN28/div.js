import EntityComponent from '../../core/EntityComponent'
import Vector3 from '../../math/Vector3'
import CollisionMode from '../systems/CollisionMode'

export default class BodyComponent extends EntityComponent {
  constructor({
    entity,
    velocity = new Vector3(),
    friction = 1,
    gravity = 1,
    height = 48,
    radius = 16,
    stepSize = 16,
    collisionMode = CollisionMode.STOP,
    sector = null,
    walls = new Set(),
    entities = new Set()
  } = {}) {
    super(entity)

    /**
     * Velocidad
     *
     * @type {Vector3}
     */
    this.velocity = velocity

    /**
     * Fricción
     *
     * @type {number}
     */
    this.friction = friction

    /**
     * Gravedad
     *
     * @type {number}
     */
    this.gravity = gravity

    /**
     * Altura del "cuerpo".
     *
     * @type {number}
     */
    this.height = height

    /**
     * Radio del "cuerpo"
     *
     * @type {number}
     */
    this.radius = radius

    /**
     * Modo de colisión
     *
     * @type {CollisionMode}
     */
    this.collisionMode = collisionMode

    /**
     * Sector en el que se encuentra el "cuerpo".
     *
     * @type {Sector}
     */
    this.sector = sector

    /**
     * Paredes con las que ha colisionado el cuerpo.
     *
     * @type {Set<Wall>}
     */
    this.walls = walls

    /**
     * Entidades con las que ha colisionado el cuerpo.
     *
     * @type {Set<Entity>}
     */
    this.entities = entities

    /**
     * Tamaño del paso, esto permite a los "cuerpos"
     * superar ciertos escalones.
     *
     * @type {number}
     */
    this.stepSize = stepSize

    /**
     * Indica si el cuerpo está en el suelo o no.
     *
     * @type {boolean}
     */
    this.isOnGround = false
  }
}
