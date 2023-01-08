/**
 * Crea un `HTMLCanvasElement`
 *
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function create(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * Crea un `OffscreenCanvas`
 *
 * @param {number} width
 * @param {number} height
 * @returns {OffscreenCanvas}
 */
export function createOffscreen(width, height) {
  if (window.OffscreenCanvas) {
    return new OffscreenCanvas(width, height)
  }
  console.warn('OffscreenCanvas not supported, creating HTMLCanvasElement')
  return create(width, height)
}

/**
 * Obtiene un contexto a partir del canvas.
 *
 * @param {HTMLCanvasElement|OffscreenCanvas} canvas
 * @param {'2d'|'webgl'|'webgl2'|'imagebitmap'} id
 * @param {CanvasRenderingContext2DSettings|WebGLContextAttributes|ImageBitmapRenderingContextSettings} attributes
 * @returns {CanvasRenderingContext2D|WebGLRenderingContext|WebGL2RenderingContext|ImageBitmapRenderingContext}
 */
export function getContext(canvas, id, attributes) {
  const context =  canvas.getContext(id, attributes)
  if (!context) {
    throw new Error(`Cannot get context "${id}"`)
  }
  return context
}

/**
 * Crea un nuevo contexto con el tamaño indicado.
 *
 * @param {number} width
 * @param {number} height
 * @param {'2d'|'webgl'|'webgl2'|'imagebitmap'} id
 * @param {CanvasRenderingContext2DSettings|WebGLContextAttributes|ImageBitmapRenderingContextSettings} attributes
 * @returns {CanvasRenderingContext2D|WebGLRenderingContext|WebGL2RenderingContext|ImageBitmapRenderingContext}
 */
export function createContext(width, height, id, attributes) {
  return getContext(create(width, height), id, attributes)
}

/**
 * Crea un nuevo contexto (usando un OffscreenCanvas) con el tamaño indicado.
 *
 * @param {number} width
 * @param {number} height
 * @param {'2d'|'webgl'|'webgl2'|'imagebitmap'} id
 * @param {CanvasRenderingContext2DSettings|WebGLContextAttributes|ImageBitmapRenderingContextSettings} attributes
 * @returns {CanvasRenderingContext2D|WebGLRenderingContext|WebGL2RenderingContext|ImageBitmapRenderingContext}
 */
export function createOffscreenContext(width, height, id, attributes) {
  return getContext(createOffscreen(width, height), id, attributes)
}

/**
 * Redimensiona el canvas.
 *
 * @param {HTMLCanvasElement|OffscreenCanvas} canvas
 * @param {number} width
 * @param {number} height
 * @returns {boolean}
 */
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

/**
 * Redimensiona el canvas al tamaño del contenedor del cliente.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} [multiplier=1.0] Multiplicador
 * @returns {boolean}
 */
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
