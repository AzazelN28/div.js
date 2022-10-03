export function addEventListeners(target, types, listener) {
  types.forEach((type) => target.addEventListener(type, listener))
}

export function removeEventListeners(target, types, listener) {
  types.forEach((type) => target.removeEventListener(type, listener))
}
