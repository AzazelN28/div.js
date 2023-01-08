/**
 * Añade múltiples event listeners a un elemento objetivo.
 *
 * @param {EventTarget} target
 * @param {Array<string>} types
 * @param {Function} listener
 */
export function addEventListeners(target, types, listener) {
  types.forEach((type) => target.addEventListener(type, listener))
}

/**
 * Elimina múltiples event listeners de un elemento objetivo.
 *
 * @param {EventTarget} target
 * @param {Array<string>} types
 * @param {Function} listener
 */
export function removeEventListeners(target, types, listener) {
  types.forEach((type) => target.removeEventListener(type, listener))
}

export default {
  addEventListeners,
  removeEventListeners
}
