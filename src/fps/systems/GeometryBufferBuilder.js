/**
 * Divisor de textura (resolución por defecto)
 *
 * @type {number}
 */
export const TEX_BASE = 64

/**
 * Construye el buffer de coordenadas de una pared.
 *
 * @param {Vector2} start
 * @param {Vector2} end
 * @param {number} floor
 * @param {number} ceiling
 * @returns {Float32Array}
 */
export function buildWall({ x: sx, y: sy }, { x: ex, y: ey }, floor, ceiling) {
  const d = Math.hypot(ex - sx, ey - sy)
  // TODO: El 0 se puede reemplazar por un offset
  // de esta forma, podríamos obtener el comienzo
  // de la coordenada u y v como su y sv y la
  // coordenada final como su + d y sv + d.
  // También podemos añadir una opción de tiling
  // para que una textura se puede repetir más
  // o menos veces.
  return new Float32Array([
    sx, ceiling, sy, 0, ceiling / TEX_BASE,
    ex, ceiling, ey, d / TEX_BASE, ceiling / TEX_BASE,
    ex, floor, ey, d / TEX_BASE, floor / TEX_BASE,
    sx, floor, sy, 0, floor / TEX_BASE
  ])
}

/**
 * Construye el buffer de coordenadas de un plano.
 *
 * @param {Array<vec2>} coords
 * @param {number} height
 * @param {boolean} [reverse=false]
 * @returns {Float32Array}
 */
export function buildPlaneFromCoords(coords, height, reverse = false) {
  const usedCoords = coords.slice()
  if (reverse) {
    usedCoords.reverse()
  }
  const computedCoords = usedCoords.flatMap(({ x, y }) => {
    return [x, height, y, x / TEX_BASE, y / TEX_BASE]
  })
  return new Float32Array(computedCoords)
}

export default {
  buildWall,
  buildPlaneFromCoords
}
