import { vec3, mat4 } from 'gl-matrix'
import GLU from './GLU'
import FacetedSprite from './FacetedSprite'
import ViewComponent from '../components/ViewComponent'
import Rect from '../../math/Rect'
import ProgramDefault from './shaders/default'
import GeometryBufferBuilder from './GeometryBufferBuilder'
import SpriteComponent from '../components/SpriteComponent'
import Texture from './Texture'
import Resources from '../../core/Resources'
import EntityComponentRegistry from '../../core/EntityComponentRegistry'
import Level from '../level/Level'
import FacetedSpriteComponent from '../components/FacetedSpriteComponent'
export default class Renderer {
  #canvas
  /**
   * Contexto de renderizado.
   *
   * @type {WebGLRenderingContext}
   */
  #context

  /**
   * @type {Resources}
   */
  #resources

  /**
   * @type {EntityComponentRegistry}
   */
  #registry

  /**
   * @type {Level}
   */
  #level

  #debug = new Array()

  /**
   * @type {WebGLProgram}
   */
  #program = null
  #programInfo = null

  /**
   * @type {Map<*, WebGLBuffer>}
   */
  #buffers = new Map()

  /**
   * @type {Map<*, WebGLTexture>}
   */
  #textures = new Map()

  /**
   *
   * @param {RendererOptions} options
   */
  constructor({ level, canvas, registry, resources }) {
    this.#level = level

    this.#canvas = canvas
    this.#context = canvas.getContext('webgl2')

    this.#resources = resources
    this.#registry = registry

    const gl = this.#context

    // TODO: Todo esto se podría enviar a una función llamada "start"
    // o "init" o "setup".
    this.#buffers.set('sprite', {
      buffer: GLU.createBuffer(
        gl,
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1, 0, 0, 1,
          1, -1, 0, 1, 1,
          1,  1, 0, 1, 0,
          -1,  1, 0, 0, 0,
        ]),
        gl.STATIC_DRAW
      ),
      count: 4
    })

    const checkerboardTexture = Texture.createCheckerboard(64)
    this.#textures.set('default', GLU.createTextureFromSource(gl, checkerboardTexture))

    this.#program = GLU.createProgramFromSources(
      gl,
      ProgramDefault.vertex,
      ProgramDefault.fragment
    )
    this.#programInfo = GLU.getProgramAttributesAndUniforms(gl, this.#program)
  }

  get debug() {
    return this.#debug
  }

  #renderMaskedWall(time, view, wall) {
    const gl = this.#context
    gl.uniform2f(this.#programInfo.uniforms.u_flip.location, 0, 0)
    gl.uniformMatrix4fv(
      this.#programInfo.uniforms.u_modelViewProjection.location,
      gl.FALSE,
      view.perspectiveView
    )

    GLU.setTexture(
      gl,
      this.#programInfo.uniforms.u_sampler.location,
      this.#textures.get(wall.middle.texture),
      0
    )
    const { buffer } = this.#buffers.get(wall.middle)
    GLU.drawQuad(gl, buffer)
    GLU.unsetTexture(gl)

    view.renderedWalls++
  }

  #renderMaskedWalls(time, view) {
    for (const wall of view.maskedWalls) {
      this.#renderMaskedWall(time, view, wall)
    }
  }

  #renderMaskedFacetedSprite(time, view, sprite) {
    const gl = this.#context
    const viewTransform = view.entity.get('transform')
    const transform = sprite.entity.get('transform')
    const angleBetween = FacetedSprite.getAngleBetween(viewTransform.position, transform.position)
    const sourceIndex = FacetedSprite.getIndexByAngle(
      angleBetween,
      transform.rotation,
      sprite.sources.length
    )
    const source = sprite.sources[sourceIndex]
    const flipX = sprite?.isFlipped ? (sourceIndex > (sprite.sources.length >> 1) ? 1.0 : 0.0) : 0.0
    const flipY = 1

    vec3.set(
      view.position,
      transform.position.x,
      transform.position.z + sprite.pivot,
      transform.position.y
    )

    mat4.identity(view.model)
    mat4.identity(view.modelViewProjection)
    mat4.translate(view.model, view.model, view.position)
    // TODO: Podríamos hacer un ajuste "más fino" de la rotación
    // pero realmente con esto vale por el momento.
    mat4.rotateY(
      view.model,
      view.model,
      -viewTransform.rotation + Math.PI * 0.5
    )
    mat4.scale(view.model, view.model, [sprite.width, sprite.height, 1])
    mat4.multiply(view.modelViewProjection, view.perspectiveView, view.model)

    gl.uniformMatrix4fv(
      this.#programInfo.uniforms.u_modelViewProjection.location,
      gl.FALSE,
      view.modelViewProjection
    )

    gl.uniform2f(this.#programInfo.uniforms.u_flip.location, flipX, flipY)
    GLU.setTexture(
      gl,
      this.#programInfo.uniforms.u_sampler.location,
      this.#textures.has(source)
        ? this.#textures.get(source)
        : this.#textures.get('default'),
      0
    )
    const { buffer } = this.#buffers.get('sprite')
    GLU.drawQuad(gl, buffer)
    GLU.unsetTexture(gl)

    view.renderedEntities++
  }

  #renderMaskedSprite(time, view, sprite) {
    const gl = this.#context
    const viewTransform = view.entity.get('transform')
    const transform = sprite.entity.get('transform')

    vec3.set(
      view.position,
      transform.position.x,
      transform.position.z + sprite.pivot,
      transform.position.y
    )

    mat4.identity(view.model)
    mat4.identity(view.modelViewProjection)
    mat4.translate(view.model, view.model, view.position)
    // TODO: Podríamos hacer un ajuste "más fino" de la rotación
    // pero realmente con esto vale por el momento.
    mat4.rotateY(view.model, view.model, -viewTransform.rotation + Math.PI * 0.5)
    mat4.scale(view.model, view.model, [sprite.width, sprite.height, 1])
    mat4.multiply(view.modelViewProjection, view.perspectiveView, view.model)

    gl.uniformMatrix4fv(
      this.#programInfo.uniforms.u_modelViewProjection.location,
      gl.FALSE,
      view.modelViewProjection
    )

    gl.uniform2f(this.#programInfo.uniforms.u_flip.location, 0, 1)
    GLU.setTexture(
      gl,
      this.#programInfo.uniforms.u_sampler.location,
      this.#textures.has(sprite.source)
        ? this.#textures.get(sprite.source)
        : this.#textures.get('default'),
      0
    )
    const { buffer } = this.#buffers.get('sprite')
    GLU.drawQuad(gl, buffer)
    GLU.unsetTexture(gl)

    view.renderedEntities++
  }

  #renderMaskedSprites(time, view) {
    for (const sprite of this.#registry.get(SpriteComponent)) {
      this.#renderMaskedSprite(time, view, sprite)
    }
  }

  #renderMasked(time, view) {
    this.#renderMaskedSprites(time, view)
    this.#renderMaskedWalls(time, view)
  }

  #renderMaskedSorted(time, view) {
    const transform = view.entity.get('transform')
    {
      const facetedSprites = Array.from(this.#registry.get(FacetedSpriteComponent))
      const maskedSprites = facetedSprites.map((sprite) => {
        const spriteTransform = sprite.entity.get('transform')
        const distance = spriteTransform.position.distanceTo(transform.position)
        return {
          type: 'faceted-sprite',
          object: sprite,
          distance
        }
      })
      view.masked.push(...maskedSprites)
    }
    {
      const sprites = Array.from(this.#registry.get(SpriteComponent))
      const maskedSprites = sprites.map((sprite) => {
        const spriteTransform = sprite.entity.get('transform')
        const distance = spriteTransform.position.distanceTo(transform.position)
        return {
          type: 'sprite',
          object: sprite,
          distance
        }
      })
      view.masked.push(...maskedSprites)
    }
    const sortedMasked = view.masked.sort((a, b) => b.distance - a.distance)
    for (const masked of sortedMasked) {
      if (masked.type === 'wall') {
        this.#renderMaskedWall(time, view, masked.object)
      } else if (masked.type === 'sprite') {
        this.#renderMaskedSprite(time, view, masked.object)
      } else if (masked.type === 'faceted-sprite') {
        this.#renderMaskedFacetedSprite(time, view, masked.object)
      }
    }
  }

  #renderWalls(time, view) {
    const gl = this.#context

    view.renderedWalls = 0
    // vacíamos el array de masked.
    // view.maskedWalls.length = 0
    view.masked.length = 0

    gl.uniform2f(this.#programInfo.uniforms.u_flip.location, 0, 0)

    const transform = view.entity.get('transform')
    /*
    const wallDistances = Array.from(view.walls).map((wall) => {
      const distance = wall.line.distance(transform.position)
      return {
        wall,
        distance
      }
    })
    const sortedWalls = wallDistances.sort((a, b) => b.distance - a.distance)
    */

    // TODO: Esto lo podemos renderizar utilizando la distancia
    // de la pared a la vista de tal forma que siempre podemos
    // renderizar de atrás a adelante.
    for (const wall of view.walls) {
      if (wall.isDoubleSided) {
        // gl.uniform3f(this.#programInfo.uniforms.u_color.location, 1, 1, 0)
        // Esto es parte de la geometría de la pared.
        if (wall.bottom.texture) {
          GLU.setTexture(
            gl,
            this.#programInfo.uniforms.u_sampler.location,
            this.#textures.get(wall.bottom.texture),
            0
          )
          const { buffer } = this.#buffers.get(wall.bottom)
          GLU.drawQuad(gl, buffer)
          GLU.unsetTexture(gl)

          view.renderedWalls++
        }

        if (wall.middle.texture) {
          const distance = wall.line.distance(transform.position)
          view.masked.push({
            type: 'wall',
            object: wall,
            distance
          })
        }

        if (wall.top.texture) {
          GLU.setTexture(
            gl,
            this.#programInfo.uniforms.u_sampler.location,
            this.#textures.get(wall.top.texture),
            0
          )
          const { buffer } = this.#buffers.get(wall.top)
          GLU.drawQuad(gl, buffer)
          GLU.unsetTexture(gl)

          view.renderedWalls++
        }
      } else {
        // gl.uniform3f(this.#programInfo.uniforms.u_color.location, 0, 1, 1)
        GLU.setTexture(
          gl,
          this.#programInfo.uniforms.u_sampler.location,
          this.#textures.get(wall.middle.texture),
          0
        )
        const { buffer } = this.#buffers.get(wall.middle)
        GLU.drawQuad(gl, buffer)
        GLU.unsetTexture(gl)
      }
    }
  }

  #renderSectors(time, view) {
    const gl = this.#context
    view.renderedPlanes = 0
    // TODO: No tengo muy claro si esta debería ser la forma
    // de hacer esto.
    view.entities.clear()
    gl.uniform2f(this.#programInfo.uniforms.u_flip.location, 0, 0)
    for (const sector of view.sectors) {
      const { floor, ceiling } = sector
      // TODO: Esto hay que revisarlo
      /*
      for (const [entity, body] of state.components.bodies) {
        if (body.sector === sectorIndex) {
          view.entities.add(entity)
        }
      }
      */

      if (!floor.texture && !ceiling.texture) {
        continue
      }

      // gl.uniform3f(this.#programInfo.uniforms.u_color.location, 1, 0, 1)
      if (floor.texture) {
        GLU.setTexture(gl, this.#programInfo.uniforms.u_sampler.location, this.#textures.get(floor.texture), 0)
        const { buffer, count } = this.#buffers.get(floor)
        GLU.drawPoly(gl, buffer, count)
        GLU.unsetTexture(gl)

        view.renderedPlanes++
      }

      // gl.uniform3f(this.#programInfo.uniforms.u_color.location, 0.5, 0, 0.5)
      if (ceiling.texture) {
        GLU.setTexture(gl, this.#programInfo.uniforms.u_sampler.location, this.#textures.get(ceiling.texture), 0)
        const { buffer, count } = this.#buffers.get(ceiling)
        GLU.drawPoly(gl, buffer, count)
        GLU.unsetTexture(gl)

        view.renderedPlanes++
      }
    }
  }

  /**
   * Renderizamos la vista 3D.
   *
   * @param {number} time
   * @param {ViewComponent} view
   */
  #render3D(time, view) {
    /**
     * @type {WebGLRenderingContext}
     */
    const gl = this.#context
    if (view.rect instanceof Rect) {
      gl.viewport(
        view.rect.left,
        view.rect.top,
        view.rect.right,
        view.rect.bottom
      )
      mat4.perspective(
        view.perspective,
        view.fieldOfView,
        view.rect.aspectRatio,
        view.near,
        view.far
      )
      mat4.ortho(view.ortho, 0, view.rect.width, view.rect.height, 0, -1, 1)
    } else {
      gl.viewport(0, 0, this.#canvas.width, this.#canvas.height)
      mat4.perspective(
        view.perspective,
        view.fieldOfView,
        this.#canvas.width / this.#canvas.height,
        view.near,
        view.far
      )
      mat4.ortho(
        view.ortho,
        0,
        this.#canvas.width,
        this.#canvas.height,
        0,
        -1,
        1
      )
    }

    const transform = view.entity.get('transform')
    const body = view.entity.get('body')

    // TODO: Calcular la altura del jugador con esta movida.
    vec3.set(
      view.position,
      transform.position.x,
      transform.position.z + body.height,
      transform.position.y
    )

    // Sets the rotation matrix
    mat4.identity(view.rotation)
    mat4.rotateY(view.rotation, view.rotation, -transform.rotation - Math.PI * 0.5)
    // mat4.rotateX(rotation, rotation, viewAngles[0])
    // vec3.sub(viewPosition, position, viewHeight)

    // Sets the model matrix.
    mat4.identity(view.transform)
    mat4.translate(view.transform, view.transform, view.position)
    mat4.multiply(view.transform, view.transform, view.rotation)
    mat4.invert(view.inverse, view.transform)
    mat4.multiply(view.perspectiveView, view.perspective, view.inverse)

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

    this.#renderWalls(time, view)
    this.#renderSectors(time, view)

    // gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    this.#renderMaskedSorted(time, view)

    gl.disable(gl.BLEND)
    // gl.enable(gl.DEPTH_TEST)
  }

  /**
   * Renderiza todos los elementos de la vista 2D (el HUD, el menú, etc).
   *
   * @param {number} time
   * @param {ViewComponent} view
   */
  #render2D(time, view) {
    // TODO: Aquí deberíamos renderizar los elementos del HUD que se corresponden
    // con esta vista.
  }

  /**
   *
   * @param {number} time
   * @param {ViewComponent} view
   */
  #renderView(time, view) {
    // TODO: Update View Matrices
    this.#render3D(time, view)
    this.#render2D(time, view)
  }

  /**
   * Renderizamos todas las escenas a partir de los ViewComponents.
   *
   * @param {number} time
   */
  render(time) {
    const gl = this.#context
    // TODO: Aquí podríamos añadir una comprobación sobre si
    // se inicializaron los bufferes y las texturas.
    for (const wall of this.#level.walls) {
      if (wall.isDoubleSided) {
        if (wall.top.texture != null) {
          if (!this.#buffers.has(wall.top)) {
            const vertices = GeometryBufferBuilder.buildWall(
              wall.start,
              wall.end,
              Math.min(wall.front.ceiling.height, wall.back.ceiling.height),
              Math.max(wall.front.ceiling.height, wall.back.ceiling.height)
            )
            const buffer = GLU.createBuffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            this.#buffers.set(wall.top, { buffer, count: 4 })
          }
          if (!this.#textures.has(wall.top.texture)) {
            const texture = GLU.createTextureFromSource(gl, this.#resources.get(wall.top.texture))
            this.#textures.set(wall.top.texture, texture)
          }
        }
        if (wall.middle.texture != null) {
          if (!this.#buffers.has(wall.middle)) {
            const vertices = GeometryBufferBuilder.buildWall(
              wall.start,
              wall.end,
              Math.max(wall.front.floor.height, wall.back.floor.height),
              Math.min(wall.front.ceiling.height, wall.back.ceiling.height)
            )
            const buffer = GLU.createBuffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            this.#buffers.set(wall.middle, { buffer, count: 4 })
          }
          if (!this.#textures.has(wall.middle.texture)) {
            const texture = GLU.createTextureFromSource(gl, this.#resources.get(wall.middle.texture))
            this.#textures.set(wall.middle.texture, texture)
          }
        }
        if (wall.bottom.texture != null) {
          if (!this.#buffers.has(wall.bottom)) {
            const vertices = GeometryBufferBuilder.buildWall(
              wall.start,
              wall.end,
              Math.min(wall.front.floor.height, wall.back.floor.height),
              Math.max(wall.front.floor.height, wall.back.floor.height)
            )
            const buffer = GLU.createBuffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            this.#buffers.set(wall.bottom, { buffer, count: 4 })
          }
          if (!this.#textures.has(wall.bottom.texture)) {
            const texture = GLU.createTextureFromSource(gl, this.#resources.get(wall.bottom.texture))
            this.#textures.set(wall.bottom.texture, texture)
          }
        }
      } else {
        if (wall.middle.texture != null) {
          if (!this.#buffers.has(wall.middle)) {
            const vertices = GeometryBufferBuilder.buildWall(wall.start, wall.end, wall.front.floor.height, wall.front.ceiling.height)
            const buffer = GLU.createBuffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            this.#buffers.set(wall.middle, { buffer, count: 4 })
          }
          if (!this.#textures.has(wall.middle.texture)) {
            const texture = GLU.createTextureFromSource(gl, this.#resources.get(wall.middle.texture))
            this.#textures.set(wall.middle.texture, texture)
          }
        }
      }
    }

    for (const sector of this.#level.sectors) {
      if (sector.floor.texture != null)
      {
        if (!this.#buffers.has(sector.floor)) {
          const coords = sector.walls.map((wall) => wall.start)
          const vertices = GeometryBufferBuilder.buildPlaneFromCoords(coords, sector.floor.height)
          const buffer = GLU.createBuffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
          this.#buffers.set(sector.floor, { buffer, count: coords.length })
        }
        if (!this.#textures.has(sector.floor.texture)) {
          const texture = GLU.createTextureFromSource(gl, this.#resources.get(sector.floor.texture))
          this.#textures.set(sector.floor.texture, texture)
        }
      }
      if (sector.ceiling.texture != null)
      {
        if (!this.#buffers.has(sector.ceiling)) {
          const coords = sector.walls.map((wall) => wall.start)
          const vertices = GeometryBufferBuilder.buildPlaneFromCoords(coords, sector.ceiling.height, true)
          const buffer = GLU.createBuffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
          this.#buffers.set(sector.ceiling, { buffer, count: coords.length })
        }
        if (!this.#textures.has(sector.ceiling.texture)) {
          const texture = GLU.createTextureFromSource(gl, this.#resources.get(sector.ceiling.texture))
          this.#textures.set(sector.ceiling.texture, texture)
        }
      }
    }

    for (const sprite of this.#registry.get(FacetedSpriteComponent))
    {
      for (const source of sprite.sources) {
        if (!this.#textures.has(source)) {
          const texture = GLU.createTextureFromSource(gl, source)
          this.#textures.set(source, texture)
        }
      }
    }

    for (const sprite of this.#registry.get(SpriteComponent)) {
      if (!sprite.source)
        continue

      if (!this.#textures.has(sprite.source)) {
        const texture = GLU.createTextureFromSource(gl, sprite.source)
        this.#textures.set(sprite.source, texture)
      }
    }

    for (const view of this.#registry.get(ViewComponent)) {
      this.#renderView(time, view)
    }
  }

  renderDebug(time) {}
}
