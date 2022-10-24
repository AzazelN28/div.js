import ViewComponent from '../components/ViewComponent'

export default class Renderer {
  #canvas
  /**
   * Contexto de renderizado.
   *
   * @type {WebGLRenderingContext}
   */
  #context

  /**
   * Componentes de la vista.
   *
   * @type {Set<ViewComponent>}
   */
  #views = new Set()
  #debug = new Array()

  constructor({ level, canvas }) {
    this.#level = level
    this.#canvas = canvas
    this.#context = canvas.getContext('webgl')
  }

  #render3D(time, entity, view) {
    /**
     * @type {WebGLRenderingContext}
     */
    const gl = this.#context

    gl.viewport(
      view.rect.left,
      view.rect.top,
      view.rect.right,
      view.rect.bottom
    )

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)

    gl.cullFace(gl.FRONT)
    gl.useProgram(this.#program)

    gl.uniformMatrix4fv(
      this.#programInfo.uniforms.u_modelViewProjection.location,
      gl.FALSE,
      view.perspectiveView
    )

    this.#renderWalls(time, entity, view)
    this.#renderSectors(time, entity, view)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    this.#renderTransparent(time, entity, view)

    gl.disable(gl.BLEND)
  }

  #render2D(time, entity, view) {
    // TODO: Aquí deberíamos renderizar los elementos del HUD que se corresponden
    // con esta vista.
  }

  #renderView(time, entity, view) {
    // TODO: Update View Matrices
    this.#render3D(time, entity, view)
    this.#render2D(time, entity, view)
  }

  render(time) {
    for (const [entity, view] of this.#views) {
      this.#renderView(time, entity, view)
    }
  }
}
