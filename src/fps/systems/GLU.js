export function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Cannot compile shader: ${gl.getShaderInfoLog(shader)}`)
  }
  return shader
}

export function deleteShader(gl, shader) {
  gl.deleteShader(shader)
}

export function createVertexShader(gl, source) {
  return createShader(gl, gl.VERTEX_SHADER, source)
}

export function createFragmentShader(gl, source) {
  return createShader(gl, gl.FRAGMENT_SHADER, source)
}

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

export function createProgramFromSources(
  gl,
  vertexShaderSource,
  fragmentShaderSource
) {
  const vertexShader = createVertexShader(gl, vertexShaderSource)
  const fragmentShader = createFragmentShader(gl, fragmentShaderSource)
  return createProgram(gl, vertexShader, fragmentShader)
}

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

export function getProgramAttributesAndUniforms(gl, program) {
  return {
    attributes: getProgramAttributes(gl, program),
    uniforms: getProgramUniforms(gl, program)
  }
}

export function deleteProgram(gl, program, deleteAttachedShaders = true) {
  if (deleteAttachedShaders) {
    gl.getAttachedShaders(program).forEach((shader) => gl.deleteShader(shader))
  }
  gl.deleteProgram(program)
}

export function createBuffer(gl, target, data, usage) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, usage)
  gl.bindBuffer(target, null)
  return buffer
}

export function deleteBuffer(gl, buffer) {
  gl.deleteBuffer(buffer)
}

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

export function deleteTexture(gl, texture) {
  gl.deleteTexture(texture)
}

export function drawQuad(gl, buffer) {
  return drawPoly(gl, buffer, 4)
}

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

export function setTexture(gl, location, texture, index = 0) {
  gl.activeTexture(gl.TEXTURE0 + index)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(location, index)
}

export function unsetTexture(gl) {
  gl.bindTexture(gl.TEXTURE_2D, null)
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
  unsetTexture
}
