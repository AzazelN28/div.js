import { vec3, mat4 } from 'gl-matrix'
import GLU from './GLU'
import FacetedSprite from './FacetedSprite'
import ViewComponent from '../components/ViewComponent'
import Rect from '../../math/Rect'
import ProgramDefault from './shaders/default'
import GeometryBufferBuilder, { TEX_BASE } from './GeometryBufferBuilder'
import SpriteComponent from '../components/SpriteComponent'
import Texture from './Texture'
import Resources from '../../core/Resources'
import EntityComponentRegistry from '../../core/EntityComponentRegistry'
import Level from '../level/Level'
import Wall from '../level/Wall'
import Sector from '../level/Sector'
import FacetedSpriteComponent from '../components/FacetedSpriteComponent'
import UISpriteComponent from '../components/UISpriteComponent'
import UITextComponent from '../components/UITextComponent'
import Line from '../../math/Line'
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

    // Esto es útil para poder debuggear el renderer.
    this.debugger = false

    const gl = this.#context

    // TODO: Todo esto se podría enviar a una función llamada "start"
    // o "init" o "setup".
    this.#buffers.set('sprite', {
      buffer: GLU.createBuffer(
        gl,
        gl.ARRAY_BUFFER,
        new Float32Array([
          -0.5, -0.5, 0, 0, 0,
          0.5, -0.5, 0, 1, 0,
          0.5,  0.5, 0, 1, 1,
          -0.5,  0.5, 0, 0, 1,
        ]),
        gl.STATIC_DRAW
      ),
      count: 4
    })

    this.#textures.set(
      'default',
      GLU.createTextureFromSource(gl, Texture.createCheckerboard(64))
    )

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

  /**
   * Obtiene la textura que necesitamos renderizar.
   *
   * @param {string} texture
   * @returns {WebGLTexture}
   */
  #getTexture(texture) {
    return this.#textures.has(texture)
      ? this.#textures.get(texture)
      : this.#textures.get('default')
  }

  /**
   * Renderiza un Wall en un ViewComponent.
   *
   * @param {number} time
   * @param {ViewComponent} view
   * @param {Wall} wall
   */
  #renderMaskedWall(time, view, wall) {
    const gl = this.#context
    gl.uniform2f(this.#programInfo.uniforms.u_flip.location, 0, 0)
    gl.uniformMatrix4fv(
      this.#programInfo.uniforms.u_modelViewProjection.location,
      gl.FALSE,
      view.perspectiveView
    )
    // const source = this.#resources.get(ceiling.texture)
    // GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)
    GLU.setTexture(
      gl,
      this.#programInfo.uniforms.u_sampler.location,
      this.#getTexture(wall.middle.texture),
      0
    )
    const { buffer } = this.#buffers.get(wall.middle)
    GLU.drawQuad(gl, buffer)
    GLU.unsetTexture(gl)

    view.renderedWalls++
  }

  /**
   * Renderiza un FacetedSpriteComponent para un ViewComponent.
   *
   * @param {number} time
   * @param {ViewComponent} view
   * @param {FacetedSpriteComponent} sprite
   */
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
    const flipX = sprite?.isResourceful
      ? (
        sourceIndex > (sprite.sources.length >> 1)
          ? 1.0 - sprite.flip.x
          : sprite.flip.x
        )
      : sprite.flip.x
    const flipY = sprite.flip.y

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
    mat4.scale(view.model, view.model, [source.width, source.height, 1])
    mat4.multiply(view.modelViewProjection, view.perspectiveView, view.model)

    gl.uniformMatrix4fv(
      this.#programInfo.uniforms.u_modelViewProjection.location,
      gl.FALSE,
      view.modelViewProjection
    )

    gl.uniform2f(this.#programInfo.uniforms.u_flip.location, flipX, flipY)

    // const source = this.#resources.get(ceiling.texture)
    // GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)

    GLU.setTexture(
      gl,
      this.#programInfo.uniforms.u_sampler.location,
      this.#getTexture(source),
      0
    )
    const { buffer } = this.#buffers.get('sprite')
    GLU.drawQuad(gl, buffer)
    GLU.unsetTexture(gl)

    view.renderedMaskedFacetedSprites++
  }

  /**
   * Renderiza un SpriteComponent para el ViewComponent.
   *
   * @param {number} time
   * @param {ViewComponent} view
   * @param {SpriteComponent} sprite
   */
  #renderMaskedSprite(time, view, sprite) {
    const gl = this.#context
    const viewTransform = view.entity.get('transform')
    const transform = sprite.entity.get('transform')
    const source = sprite.source

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
    mat4.scale(view.model, view.model, [source.width, source.height, 1])
    mat4.multiply(view.modelViewProjection, view.perspectiveView, view.model)

    gl.uniformMatrix4fv(
      this.#programInfo.uniforms.u_modelViewProjection.location,
      gl.FALSE,
      view.modelViewProjection
    )

    gl.uniform2f(this.#programInfo.uniforms.u_flip.location, 0, 1)

    // const source = this.#resources.get(ceiling.texture)
    // GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)

    GLU.setTexture(
      gl,
      this.#programInfo.uniforms.u_sampler.location,
      this.#getTexture(source),
      0
    )
    const { buffer } = this.#buffers.get('sprite')
    GLU.drawQuad(gl, buffer)
    GLU.unsetTexture(gl)

    view.renderedMaskedSprites++
  }

  /**
   * Renderizamos los elementos con máscara.
   *
   * @param {number} time
   * @param {ViewComponent} view
   */
  #renderMaskedSorted(time, view) {
    const gl = this.#context
    const transform = view.entity.get('transform')
    // Aquí el array "masked" contiene las "paredes con máscara". Así
    // que lo que podemos hacer es utilizando una lista de "facetedSprites"
    // y otra de "sprites"

    const combinedMaskedSprites = []
    {
      const facetedSprites = Array.from(this.#registry.get(FacetedSpriteComponent))
      const maskedSprites = facetedSprites
        .filter((sprite) => sprite.entity)
        .map((sprite) => ({ object: sprite, distance: Infinity }))
      combinedMaskedSprites.push(...maskedSprites)
    }
    {
      const sprites = Array.from(this.#registry.get(SpriteComponent))
      const maskedSprites = sprites
        .filter((sprite) => sprite.entity)
        .map((sprite) => ({ object: sprite, distance: Infinity }))
      combinedMaskedSprites.push(...maskedSprites)
    }

    view.masked.push(...combinedMaskedSprites)

    // NOTA: Esto es bastante "intensito", habría
    // que encontrar una mejor solución a este
    // problema.
    //
    // BTW, ahora mismo lo que estamos haciendo es:
    // 1. obtenemos el plano de la vista a partir de la dirección de la entidad vista.
    // 2. obtenemos el plano de la vista como una línea infinita en esa dirección y desde la posición del objeto entidad.
    // 3. reordenamos todos los objetos a partir de sus direcciones con respecto a esa línea infinita.
    // 4. renderizamos.
    const viewDirection = transform.direction.clone().perpLeft()
    const viewPlane = new Line()
    viewPlane.start.copy(transform.position)
    viewPlane.end.copy(transform.position).add(viewDirection)

    const intersectionLine = new Line()
    intersectionLine.start.copy(transform.position)

    const sortedMasked = view.masked.sort((a, b) => {
      if (a.object instanceof Wall && b.object instanceof Wall) {
        return (
          b.object.line.distance(transform.position)
          - a.object.line.distance(transform.position)
        )
      } else if ((a.object instanceof Wall && (b.object instanceof SpriteComponent || b.object instanceof FacetedSpriteComponent))) {
        intersectionLine.end.copy(b.object.entity.get('transform').position)
        const intersectionPoint = intersectionLine.intersect(a.object.line)
        const distanceToWall = viewPlane.distance(intersectionPoint)
        return viewPlane.distance(b.object.entity.get('transform').position)
          - distanceToWall
      } else if (((a.object instanceof SpriteComponent || a.object instanceof FacetedSpriteComponent)) && b.object instanceof Wall) {
        intersectionLine.end.copy(a.object.entity.get('transform').position)
        const intersectionPoint = intersectionLine.intersect(b.object.line)
        const distanceToWall = viewPlane.distance(intersectionPoint)
        return distanceToWall
          - viewPlane.distance(a.object.entity.get('transform').position)
      } else {
        return (
          viewPlane.distance(b.object.entity.get('transform').position)
          - viewPlane.distance(a.object.entity.get('transform').position)
        )
      }
    })

    for (const masked of sortedMasked) {
      if (masked.object instanceof Wall) {
        this.#renderMaskedWall(time, view, masked.object)
      } else if (masked.object instanceof SpriteComponent) {
        gl.disable(gl.DEPTH_TEST)
        this.#renderMaskedSprite(time, view, masked.object)
        gl.enable(gl.DEPTH_TEST)
      } else if (masked.object instanceof FacetedSpriteComponent) {
        gl.disable(gl.DEPTH_TEST)
        this.#renderMaskedFacetedSprite(time, view, masked.object)
        gl.enable(gl.DEPTH_TEST)
      }
      view.renderedMasked++
    }
  }

  #renderWalls(time, view) {
    const gl = this.#context

    view.renderedWalls = 0
    // vacíamos el array de masked.
    // view.maskedWalls.length = 0
    view.masked.length = 0

    GLU.setUniform(gl, this.#programInfo.uniforms.u_flip, 0, 0)

    const transform = view.entity.get('transform')

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
            this.#getTexture(wall.bottom.texture),
            0
          )

          // const source = this.#resources.get(wall.bottom.texture)
          // GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)

          const { buffer } = this.#buffers.get(wall.bottom)
          GLU.drawQuad(gl, buffer)
          GLU.unsetTexture(gl)

          view.renderedWalls++
        }

        if (wall.middle.texture) {
          const distance = wall.line.distance(transform.position)
          if (distance > 0) {
            view.masked.push({
              object: wall,
              distance
            })
          }
        }

        if (wall.top.texture) {
          GLU.setTexture(
            gl,
            this.#programInfo.uniforms.u_sampler.location,
            this.#getTexture(wall.top.texture),
            0
          )

          // const source = this.#resources.get(wall.top.texture)
          // GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)

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
          this.#getTexture(wall.middle.texture),
          0
        )

        // const source = this.#resources.get(wall.middle.texture)
        // GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)

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
    // view.entities.clear()
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
        GLU.setTexture(gl, this.#programInfo.uniforms.u_sampler.location, this.#getTexture(floor.texture), 0)
        // const source = this.#resources.get(floor.texture)
        // GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)
        const { buffer, count } = this.#buffers.get(floor)
        GLU.drawPoly(gl, buffer, count)
        GLU.unsetTexture(gl)

        view.renderedPlanes++
      }

      // gl.uniform3f(this.#programInfo.uniforms.u_color.location, 0.5, 0, 0.5)
      if (ceiling.texture) {
        GLU.setTexture(gl, this.#programInfo.uniforms.u_sampler.location, this.#getTexture(ceiling.texture), 0)
        // const source = this.#resources.get(ceiling.texture)
        // GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)
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

    GLU.setUniform(gl, this.#programInfo.uniforms.u_texsize, 1, 1)

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
    const gl = this.#context
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    // TODO: Aquí deberíamos renderizar los elementos del HUD que se corresponden
    // con esta vista.
    for (const component of this.#registry.get(UISpriteComponent)) {
      const transform = component.entity.get('transform')
      const flipX = component.flip.x, flipY = component.flip.y
      const source = component.source
      if (!this.#textures.has(source)) {
        const texture = GLU.createTextureFromSource(gl, source)
        this.#textures.set(source, texture)
      }

      if (component.autoPivot) {
        // TODO: Esto sería si AutoPivot vale 'bottom', ya que el autoPivot
        // lo que hace es posicionar el objeto en el punto de rotación indicado.
        // TODO: Quizá sería interesante que el pivote se coloque a través
        // del vertex shader pasándole un `u_pivot`.
        vec3.set(
          view.position,
          transform.position.x,
          transform.position.y - (source.height * 0.5),
          transform.position.z
        )
      } else {
        vec3.set(
          view.position,
          transform.position.x + component.pivot.x,
          transform.position.y + component.pivot.y,
          transform.position.z
        )
      }
      mat4.identity(view.model)
      mat4.identity(view.modelViewProjection)
      mat4.translate(view.model, view.model, view.position)
      // TODO: Podríamos hacer un ajuste "más fino" de la rotación
      // pero realmente con esto vale por el momento.
      mat4.rotateZ(
        view.model,
        view.model,
        transform.rotation
      )
      mat4.scale(view.model, view.model, [component.size.x * transform.scale.x, component.size.y * transform.scale.y, transform.scale.z])
      mat4.multiply(view.modelViewProjection, view.ortho, view.model)

      gl.uniformMatrix4fv(
        this.#programInfo.uniforms.u_modelViewProjection.location,
        gl.FALSE,
        view.modelViewProjection
      )

      gl.uniform2f(this.#programInfo.uniforms.u_flip.location, flipX, flipY)
      GLU.setTexture(
        gl,
        this.#programInfo.uniforms.u_sampler.location,
        this.#getTexture(source),
        0
      )
      const { buffer } = this.#buffers.get('sprite')
      GLU.drawQuad(gl, buffer)
      GLU.unsetTexture(gl)
    }
    gl.disable(gl.BLEND)
    gl.enable(gl.DEPTH_TEST)
  }

  /**
   * Renderizamos la vista.
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
