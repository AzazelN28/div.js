/**
 * Obtenemos el ángulo entre dos entidades.
 *
 * @param {Vector2} a
 * @param {Vector2} b
 * @returns {number}
 */
export function getAngleBetween({ x: ax, y: ay }, { x: bx, y: by }) {
  return Math.atan2(ay - by, ax - bx)
}

/**
 * Obtenemos en qué "quesito" de la rueda de gráficos
 * nos encontraríamos si sólo tuviesemos en cuenta el
 * ángulo entre las dos entidades.
 *
 * @param {number} angleBetween
 * @param {number} anglePerGraph
 * @returns {number}
 */
export function getAngleIndex(angleBetween, anglePerGraph) {
  const angleIndex = Math.round(angleBetween / anglePerGraph)
  if (angleIndex < 0) {
    return 4 + (4 - Math.abs(angleIndex))
  }
  return angleIndex
}

/**
 * Obtenemos en qué "quesito" de la rueda de gráficos
 * nos encontraríamos si sólo tuvieramos el ángulo de la
 * entidad.
 *
 * @param {number} rotation
 * @param {number} anglePerGraph
 * @param {number} length
 * @returns {number}
 */
export function getRotationIndex(rotation, anglePerGraph, length) {
  return Math.round(rotation / anglePerGraph) % length
}

/**
 * Aquí lo que hacemos es calcular el "quesito" de la
 * rueda de gráficos en el que nos encontramos teniendo
 * en cuenta los otros dos índices de gráficos.
 *
 * @param {number} angleIndex
 * @param {number} rotationIndex
 * @returns {number}
 */
export function getIndex(angleIndex, rotationIndex, length) {
  const graphIndex = angleIndex + Math.abs(rotationIndex)
  if (rotationIndex > 0) {
    return (angleIndex + (length - rotationIndex)) % length
  }
  return graphIndex % length
}

/**
 * Obtenemos el graph index (la porción de quesito)
 * que debemos renderizar.
 *
 * @param {number} angleBetween
 * @param {number} rotation
 * @param {number} length
 * @returns {number}
 */
export function getIndexByAngle(angleBetween, rotation, length) {
  const anglePerGraph = (2 * Math.PI) / length
  const angleIndex = getAngleIndex(angleBetween, anglePerGraph)
  const rotationIndex = getRotationIndex(
    rotation,
    anglePerGraph,
    length
  )
  return getIndex(angleIndex, rotationIndex, length)
}

export default {
  getAngleBetween,
  getAngleIndex,
  getRotationIndex,
  getIndex,
  getIndexByAngle
}
