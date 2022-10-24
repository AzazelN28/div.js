export default class Level {
  constructor() {
    this.#vertices = []
    this.#sectors = []
    this.#walls = []
  }

  get vertices() {
    return this.#vertices
  }

  get walls() {
    return this.#walls
  }

  get sectors() {
    return this.#sectors
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
      if (sector.boundingBox.contains(x, y))
      {
        maybeIn.push(sector)
      }
    }

    if (maybeIn.length === 0) {
      return null
    }

    for (const sector of maybeIn) {
      let isInside = true
      for (const wall of sector.walls) {
        if (wall.side(point) < 0) {
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
}
