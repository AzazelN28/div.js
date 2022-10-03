export function create(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
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
  resizeFill,
  resizeTo
}
