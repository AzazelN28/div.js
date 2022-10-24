/**
 * @const {number}
 */
export const TAU = Math.PI * 2

/**
 * Relación entre grados y radianes.
 * @const {number}
 */
export const DEG_TO_RAD = Math.PI / 180

/**
 * Relación entre radianes y grados.
 * @const {number}
 */
export const RAD_TO_DEG = 180 / Math.PI

/**
 * Convierte de radianes a grados.
 *
 * @param {number} radians
 * @returns {number}
 */
export function radiansToDegrees(radians) {
  return radians * RAD_TO_DEG
}

/**
 * Convierte de grados a radianes.
 *
 * @param {number} degrees
 * @returns {number}
 */
export function degreesToRadians(degrees) {
  return degrees * DEG_TO_RAD
}

/**
 * Mantiene un ángulo entre -PI y PI.
 *
 * @param {number} value
 * @returns {number}
 */
export function clamp(value) {
  if (value < 0) {
    const times = Math.abs(Math.floor(value / TAU))
    return (value + times * TAU) - Math.PI
  } else if (value > Math.PI * 2) {
    const times = Math.floor(value / TAU)
    return (value - times * TAU) - Math.PI
  }
  return value - Math.PI
}

export default {
  radiansToDegrees,
  degreesToRadians,
  clamp
}
