import Vector2 from '../../math/Vector2'
import Line from '../../math/Line'
import Wall from '../../fps/level/Wall'
import Sector from '../../fps/level/Sector'

export default class Level {
  /**
   * Vértices del nivel.
   *
   * TODO: Creo que esta propiedad no vale para nada, la podría borrar
   * tranquilisimamente.
   *
   * @type {Array<Vertex>}
   */
  #vertices

  /**
   * Sectores del nivel.
   *
   * @type {Array<Sector>}
   */
  #sectors

  /**
   * Paredes del nivel.
   *
   * @type {Array<Wall>}
   */
  #walls

  /**
   * Constructor
   */
  constructor() {
    this.#vertices = []
    this.#sectors = []
    this.#walls = []
  }

  /**
   * Vértices
   *
   * @type {Array<Vector2>}
   */
  get vertices() {
    return this.#vertices
  }

  /**
   * Paredes
   *
   * @type {Array<Wall>}
   */
  get walls() {
    return this.#walls
  }

  /**
   * Sectores
   *
   * @type {Array<Sector>}
   */
  get sectors() {
    return this.#sectors
  }

  /**
   * Limpiamos los datos del nivel.
   */
  clear() {
    this.#sectors.length = 0
    this.#walls.length = 0
    this.#vertices.length = 0
  }

  /**
   * Establece las propiedades
   *
   * @param {Array<Vector2>} vertices
   * @param {Array<Wall>} walls
   * @param {Array<Sector>} sectors
   */
  set(vertices, walls, sectors) {
    this.#vertices.push(...vertices)
    this.#walls.push(...walls)
    this.#sectors.push(...sectors)
  }

  /**
   * Calculamos las propiedades "derivadas" de las paredes
   * y los sectores.
   */
  compute() {
    this.#walls.forEach((wall) => wall.compute())
    this.#sectors.forEach((sector) => sector.compute())
  }

  /**
   * Devuelve el sector en el que se encuentra el punto. Esta función
   * sólo comprueba las coordenadas 2D del sector. Quizá se podría hacer
   * una función que extienda este concepto y que devuelva si el
   * punto se encuentra en el sector 3D.
   *
   * @param {Point} point
   * @returns {Sector}
   */
  getSectorAt(point) {
    const maybeIn = []
    for (const sector of this.#sectors) {
      if (sector.boundingBox.contains(point)) {
        maybeIn.push(sector)
      }
    }

    if (maybeIn.length === 0) {
      return null
    }

    for (const sector of maybeIn) {
      let isInside = true
      for (const wall of sector.walls) {
        if (wall.line.side(point) < 0) {
          isInside = false
          break
        }
      }

      if (isInside) {
        console.log('Sector:', sector)
        return sector
      }
    }

    return null
  }

  /**
   * Carga la versión 0 del nivel.
   *
   * @param {LevelData} level
   */
  fromVersion0(level) {
    const vertices = level.vertices.map(([x, y]) => new Vector2(x, y))
    const sectors = level.sectors.map((data) => {
      const sector = new Sector()

      // Suelo
      sector.floor.height = data.floor.height
      sector.floor.texture = data.floor.texture
      sector.floor.textureOffset.setFromArray(data.floor.textureOffset)

      // Techo
      sector.ceiling.height = data.ceiling.height
      sector.ceiling.texture = data.ceiling.texture
      sector.ceiling.textureOffset.setFromArray(data.ceiling.textureOffset)

      sector.walls = data.walls
      return sector
    })
    const walls = level.walls.map((data) => {
      const line = new Line(vertices[data.start], vertices[data.end])
      const wall = new Wall({ line })
      // Parte superior
      wall.top.texture = data.top.texture
      wall.top.textureOffset.setFromArray(data.top.textureOffset)

      // Parte media
      wall.middle.texture = data.middle.texture
      wall.middle.textureOffset.setFromArray(data.middle.textureOffset)

      // Parte inferior
      wall.bottom.texture = data.bottom.texture
      wall.bottom.textureOffset.setFromArray(data.bottom.textureOffset)

      // Sectores
      wall.front = sectors[data.front]
      if (typeof data.back === 'number') {
        wall.back = sectors[data.back]
      }
      return wall
    })
    sectors.forEach(
      (sector) => (sector.walls = sector.walls.map((index) => walls[index]))
    )
    this.set(vertices, walls, sectors)
  }

  /**
   * Construye un nivel a partir de los datos que pasamos.
   *
   * @param {LevelData} level
   */
  from(level) {
    this.clear()
    if (level.version === 0) {
      this.fromVersion0(level)
    } else {
      throw new Error(`Unknown level version "${level.version}"`)
    }
    this.compute()
  }
}
