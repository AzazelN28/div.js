/**
 * Devuelve un valor aleatorio entre `min` y `max`.
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function between(min, max) {
  return min + Math.random() * (max - min)
}

export function roll(sides) {
  return 1 + Math.floor(Math.random() * sides)
}

export default {
  between,
  roll
}
