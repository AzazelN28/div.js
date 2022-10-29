export function create(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

export function createOffscreen(width, height) {
  if (window.OffscreenCanvas) {
    return new OffscreenCanvas(width, height)
  }
  console.warn('OffscreenCanvas not supported, creating HTMLCanvasElement')
  return create(width, height)
}

export function getContext(canvas, id, attributes) {
  const context =  canvas.getContext(id, attributes)
  if (!context) {
    throw new Error(`Cannot get context "${id}"`)
  }
  return context
}

export function createContext(width, height, id, attributes) {
  return getContext(create(width, height), id, attributes)
}

export function createOffscreenContext(width, height, id, attributes) {
  return getContext(createOffscreen(width, height), id, attributes)
}

export function resizeTo(canvas, width, height) {
  let resized = false
  const expectedWidth = Math.floor(width)
  if (canvas.width !== expectedWidth) {
    canvas.width = expectedWidth
    resized = true
  }
  const expectedHeight = Math.floor(height)
  if (canvas.height !== expectedHeight) {
    canvas.height = expectedHeight
    resized = true
  }
  return resized
}

export function resizeFill(canvas, multiplier = 1.0) {
  return resizeTo(canvas, canvas.clientWidth * multiplier, canvas.clientHeight * multiplier)
}

export default {
  create,
  getContext,
  createContext,
  createOffscreen,
  createOffscreenContext,
  resizeFill,
  resizeTo
}
