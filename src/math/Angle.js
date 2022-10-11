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

export default {
  radiansToDegrees,
  degreesToRadians,
}
