import EntityComponent from '../../core/EntityComponent'
import Vector2 from '../../math/Vector2'
import Angle from '../../math/Angle'

import { vec3, mat4 } from 'gl-matrix'

export default class ViewComponent extends EntityComponent {
  constructor({ entity, rect = null } = {}) {
    super(entity)

    // área de renderizado.
    this.rect = rect

    // FOV
    this.fieldOfView = Angle.degreesToRadians(72)

    // Planos lejanos y cercanos.
    this.near = 0.1
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

    // Lista de sectores que están visibles.
    this.sectors = new Set()

    // Lista de paredes que están visibles.
    this.walls = new Set()
    // this.sortedWalls = new Array()

    // TODO: Habrá que añadir las entidades visibles
    // o mejor dicho, los renderables visibles en la fase
    // de visibility.
    this.entities = new Set()

    // Conjunto de elementos transparentes que deben renderizarse
    // siempre de atrás hacia adelante.
    this.maskedWalls = new Array()
    this.masked = new Array()

    // Mantenemos estadísticas
    this.renderedWalls = 0
    this.renderedPlanes = 0
    this.renderedEntities = 0

    // Matrices utilizadas para renderizar la vista.
    // TODO: Crear la Matrix4
    this.position = vec3.create()
    this.rotation = mat4.create()
    this.transform = mat4.create(), // cámara.
    this.inverse = mat4.create(), // inversa de la transformación.
    this.perspective = mat4.create(), // perspectiva.
    this.ortho = mat4.create(), // ortográfica (para dibujar los sprites de las armas, etc).
    this.perspectiveView = mat4.create() // perspectiva y vista.
    this.model = mat4.create()
    this.modelViewProjection = mat4.create()
  }
}
