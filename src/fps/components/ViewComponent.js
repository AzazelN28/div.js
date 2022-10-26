import EntityComponent from '../../core/EntityComponent'
import Vector2 from '../../math/Vector2'
import Angle from '../../math/Angle'

import { vec3, mat4 } from 'gl-matrix'

export default class ViewComponent extends EntityComponent {
  constructor({ entity, rect = null } = {}) {
    super(entity)

    /**
     * Área utilizada para renderizar la vista 3D.
     *
     * @type {Rect}
     */
    this.rect = rect

    /**
     * Apertura de la cámara.
     *
     * @type {number}
     */
    this.fieldOfView = Angle.degreesToRadians(72)

    /**
     * Distancia del plano cercano.
     *
     * @type {number}
     */
    this.near = 0.1

    /**
     * Distancia del plano lejano.
     *
     * @type {number}
     */
    this.far = 1000.0

    // Ángulos.
    this.angle = {
      start: 0,
      end: 0
    }

    // Direcciones de los ángulos.
    this.direction = {
      start: new Vector2(),
      end: new Vector2()
    }

    /**
     * Lista de sectores que están visibles.
     *
     * @type {Set<Sector>}
     */
    this.sectors = new Set()

    /**
     * Lista de paredes que están visibles.
     *
     * @type {Set<Wall>}
     */
    this.walls = new Set()

    /**
     * Conjunto de elementos transparentes que deben renderizarse
     *
     * @type {Array<Masked>}
     */
    this.masked = new Array()

    /**
     * Número de paredes renderizadas.
     *
     * @type {number}
     */
    this.renderedWalls = 0
    /**
     * Número de planos (suelos y techos)
     * renderizados.
     *
     * @type {number}
     */
    this.renderedPlanes = 0
    /**
     * Número de entidades renderizadas
     *
     * @type {number}
     */
    this.renderedMasked = 0

    this.renderedMaskedWalls = 0

    /**
     * Sprites renderizados.
     *
     * @type {number}
     */
    this.renderedMaskedSprites = 0

    /**
     * Sprites con carusas renderizados.
     *
     * @type {number}
     */
    this.renderedMaskedFacetedSprites = 0

    // Matrices utilizadas para renderizar la vista.
    // TODO: Crear la Matrix4
    this.position = vec3.create()
    this.rotation = mat4.create()
    this.transform = mat4.create() // cámara.
    this.inverse = mat4.create() // inversa de la transformación.
    this.perspective = mat4.create() // perspectiva.
    this.ortho = mat4.create() // ortográfica (para dibujar los sprites de las armas, etc).
    this.perspectiveView = mat4.create() // perspectiva y vista.
    this.model = mat4.create()
    this.modelViewProjection = mat4.create()
  }
}
