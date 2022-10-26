import EntityComponent from '../../core/EntityComponent'
import Vector3 from '../../math/Vector3'
import { CollisionMode } from '../systems/Collider'

export default class BodyComponent extends EntityComponent {
  constructor({ entity } = {}) {
    super(entity)
    /**
     * Velocidad
     *
     * @type {Vector3}
     */
    this.velocity = new Vector3()
    /**
     * Fricción
     *
     * @type {number}
     */
    this.friction = 0.95
    /**
     * Gravedad
     *
     * @type {number}
     */
    this.gravity = 1
    /**
     * Altura del "cuerpo".
     *
     * @type {number}
     */
    this.height = 48
    /**
     * Radio del "cuerpo"
     *
     * @type {number}
     */
    this.radius = 16

    /**
     * Modo de colisión
     *
     * @type {CollisionMode}
     */
    this.collisionMode = CollisionMode.STOP

    /**
     * Sector en el que se encuentra el "cuerpo".
     *
     * @type {Sector}
     */
    this.sector = null

    /**
     * Paredes con las que ha colisionado el cuerpo.
     *
     * @type {Set<Wall>}
     */
    this.walls = new Set()

    /**
     * Tamaño del paso, esto permite a los "cuerpos"
     * superar ciertos escalones.
     *
     * @type {number}
     */
    this.stepSize = 16

    /**
     * Indica si el cuerpo está en el suelo o no.
     *
     * @type {boolean}
     */
    this.isOnGround = false
  }
}
