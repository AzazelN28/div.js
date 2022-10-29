import Canvas from '../../canvas/Canvas'

export function createCheckerboard(size) {
  const halfSize = size >> 1
  const canvas = Canvas.createOffscreen(size, size)
  const context = canvas.getContext('2d')
  context.fillStyle = '#fff'
  context.fillRect(0, 0, size, size)

  context.fillStyle = '#f00'
  context.fillRect(0, 0, halfSize, halfSize)
  context.fillRect(halfSize, halfSize, halfSize, halfSize)

  return canvas
}

export default {
  createCheckerboard
}
