/**
 * Crea un shader
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 * @returns {WebGLShader}
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Cannot compile shader: ${gl.getShaderInfoLog(shader)}`)
  }
  return shader
}

/**
 * Borra un shader
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} shader
 */
export function deleteShader(gl, shader) {
  gl.deleteShader(shader)
}

/**
 * Crea un vertex shader.
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @returns {WebGLShader}
 */
export function createVertexShader(gl, source) {
  return createShader(gl, gl.VERTEX_SHADER, source)
}

/**
 * Crea un fragment shader.
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @returns {WebGLShader}
 */
export function createFragmentShader(gl, source) {
  return createShader(gl, gl.FRAGMENT_SHADER, source)
}

/**
 * Crea un programa a partir de los vertex shader y fragment shader.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @returns {WebGLProgram}
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Cannot link program: ${gl.getProgramInfoLog(program)}`)
  }
  return program
}

/**
 * Crea un programa a partir de las fuentes de vertex shader y fragment shader.
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 * @returns {WebGLProgram}
 */
export function createProgramFromSources(
  gl,
  vertexShaderSource,
  fragmentShaderSource
) {
  const vertexShader = createVertexShader(gl, vertexShaderSource)
  const fragmentShader = createFragmentShader(gl, fragmentShaderSource)
  return createProgram(gl, vertexShader, fragmentShader)
}

/**
 * Definición de uniform
 *
 * @typedef {object} UniformDefinition
 * @property {number} index Índice en el programa
 * @property {string} name Nombre del uniform
 * @property {number} type Tipo de uniform
 * @property {number} size Tamaño del uniform
 * @property {WebGLUniformLocation} location Posición del uniform
 */

/**
 * Obtiene las uniforms definidas para el programa.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {object<string, UniformDefinition>}
 */
export function getProgramUniforms(gl, program) {
  const length = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  const uniforms = {}
  for (let index = 0; index < length; index++) {
    const { name, type, size } = gl.getActiveUniform(program, index)
    const location = gl.getUniformLocation(program, name)
    uniforms[name] = { index, name, type, size, location }
  }
  return uniforms
}

/**
 * @typedef {object} AttributeDefinition
 * @property {number} index Índice en el programa
 * @property {string} name Nombre del attribute
 * @property {number} type Tipo de attribute
 * @property {number} size Tamaño del attribute
 * @property {number} location Posición del attribute
 */

/**
 * Obtiene la lista de atributos del programa.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {object<string, AttributeDefinition>}
 */
export function getProgramAttributes(gl, program) {
  const length = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
  const attributes = {}
  for (let index = 0; index < length; index++) {
    const { name, type, size } = gl.getActiveAttrib(program, index)
    const location = gl.getAttribLocation(program, name)
    attributes[name] = { index, name, type, size, location }
  }
  return attributes
}

/**
 * Definición de atributos y uniforms.
 *
 * @typedef {object} UniformAttributeDefinition
 * @property {object<string, AttributeDefinition>} attributes
 * @property {object<string, UniformDefinition} uniforms
 */

/**
 * Obtiene tanto las definiciones de los uniforms como de los
 * atributos.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {UniformAttributeDefinition}
 */
export function getProgramAttributesAndUniforms(gl, program) {
  return {
    attributes: getProgramAttributes(gl, program),
    uniforms: getProgramUniforms(gl, program)
  }
}

/**
 * Borra el programa.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {boolean} [deleteAttachedShaders=true]
 */
export function deleteProgram(gl, program, deleteAttachedShaders = true) {
  if (deleteAttachedShaders) {
    gl.getAttachedShaders(program).forEach((shader) => gl.deleteShader(shader))
  }
  gl.deleteProgram(program)
}

/**
 * Crea un buffer
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} target
 * @param {number|TypedArray} data
 * @param {number} usage
 * @returns {WebGLBuffer}
 */
export function createBuffer(gl, target, data, usage) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, usage)
  gl.bindBuffer(target, null)
  return buffer
}

/**
 * Borra un buffer
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLBuffer} buffer
 */
export function deleteBuffer(gl, buffer) {
  gl.deleteBuffer(buffer)
}

/**
 * Crea una textura a partir de una fuente.
 *
 * @param {WebGLRenderingContext} gl
 * @param {HTMLVideoElement|HTMLImageElement|HTMLCanvasElement} source
 * @returns {WebGLTexture}
 */
export function createTextureFromSource(gl, source) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    source.width,
    source.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    source
  )
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.bindTexture(gl.TEXTURE_2D, null)
  return texture
}

/**
 * Borra una textura.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLTexture} texture
 */
export function deleteTexture(gl, texture) {
  gl.deleteTexture(texture)
}

/**
 * Renderiza un quad.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLBuffer} buffer
 */
export function drawQuad(gl, buffer) {
  drawPoly(gl, buffer, 4)
}

/**
 * Renderiza cualquier polígono usando TRIANGLE_FAN.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLBuffer} buffer
 * @param {number} count
 */
export function drawPoly(gl, buffer, count) {
  gl.enableVertexAttribArray(0)
  gl.enableVertexAttribArray(1)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 5 * 4, 0)
  gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 5 * 4, 3 * 4)

  gl.drawArrays(gl.TRIANGLE_FAN, 0, count)

  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  gl.disableVertexAttribArray(1)
  gl.disableVertexAttribArray(0)
}

/**
 * Establece la textura que se tiene que renderizar.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLUniformLocation} location
 * @param {WebGLTexture} texture
 * @param {number} index
 */
export function setTexture(gl, location, texture, index = 0) {
  gl.activeTexture(gl.TEXTURE0 + index)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(location, index)
}

/**
 * Quita el renderizado de texturas.
 *
 * @param {WebGLRenderingContext} gl
 */
export function unsetTexture(gl) {
  gl.bindTexture(gl.TEXTURE_2D, null)
}

/**
 * Establece un uniform a partir de su definición.
 *
 * @param {WebGLRenderingContext} gl
 * @param {UniformDefinition} uniform
 * @param  {...any} values
 */
export function setUniform(gl, uniform, ...values) {
  if (uniform.type === gl.FLOAT_VEC2) {
    gl.uniform2f(uniform.location, ...values)
  } else if (uniform.type === gl.FLOAT_VEC3) {
    gl.uniform3f(uniform.location, ...values)
  } else if (uniform.type === gl.FLOAT_VEC4) {
    gl.uniform4f(uniform.location, ...values)
  } else if (uniform.type === gl.INT_VEC2) {
    gl.uniform2i(uniform.location, ...values)
  } else if (uniform.type === gl.INT_VEC3) {
    gl.uniform3i(uniform.location, ...values)
  } else if (uniform.type === gl.INT_VEC4) {
    gl.uniform4i(uniform.location, ...values)
  } else if (uniform.type === gl.FLOAT_MAT2) {
    gl.uniformMatrix2fv(uniform.location, gl.FALSE, ...values)
  } else if (uniform.type === gl.FLOAT_MAT3) {
    gl.uniformMatrix3fv(uniform.location, gl.FALSE, ...values)
  } else if (uniform.type === gl.FLOAT_MAT4) {
    gl.uniformMatrix4fv(uniform.location, gl.FALSE, ...values)
  }
}

export default {
  createShader,
  deleteShader,
  createVertexShader,
  createFragmentShader,
  createProgram,
  createProgramFromSources,
  getProgramUniforms,
  getProgramAttributes,
  getProgramAttributesAndUniforms,
  deleteProgram,
  createBuffer,
  deleteBuffer,
  createTextureFromSource,
  deleteTexture,
  drawPoly,
  drawQuad,
  setTexture,
  unsetTexture,
  setUniform
}
