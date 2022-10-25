import TransformComponent from '../components/TransformComponent'
import ViewComponent from '../components/ViewComponent'

export default class RendererDebug {
  #level = null
  #canvas = null
  #context = null
  #debug = new Array()
  #registry = null

  constructor({ level, canvas, registry }) {
    this.#level = level
    this.#canvas = canvas
    this.#context = canvas.getContext('2d')
    this.#registry = registry
    this.#debug = new Array()
  }

  get canvas() {
    return this.#canvas
  }

  get context() {
    return this.#context
  }

  get debug() {
    return this.#debug
  }

  render(time) {
    this.#context.clearRect(
      0,
      0,
      this.#context.canvas.width,
      this.#context.canvas.height
    )
    this.#context.save()
    this.#context.translate(
      this.#context.canvas.width >> 1,
      this.#context.canvas.height >> 1
    )
    this.#context.font = '16px monospace'
    this.#context.textAlign = 'center'
    this.#context.textBaseline = 'middle'
    for (const sector of this.#level.sectors) {
      this.#context.strokeStyle = '#707'
      this.#context.strokeRect(sector.boundingBox.x, sector.boundingBox.y, sector.boundingBox.width, sector.boundingBox.height)
      this.#context.fillStyle = '#f0f'
      this.#context.fillText(`f: ${sector.floor.height}, c: ${sector.ceiling.height}`, sector.boundingBox.centerX, sector.boundingBox.centerY)
    }
    for (const wall of this.#level.walls) {
      this.#context.beginPath()
      this.#context.moveTo(wall.start.x, wall.start.y)
      this.#context.lineTo(wall.end.x, wall.end.y)
      this.#context.strokeStyle = wall.isDoubleSided ? '#777' : '#f00'
      this.#context.stroke()

      this.#context.beginPath()
      this.#context.moveTo(wall.end.x, wall.end.y)
      this.#context.lineTo(
        wall.end.x + wall.tangent.x * 8 + wall.normal.x * 8,
        wall.end.y + wall.tangent.y * 8 + wall.normal.y * 8
      )
      this.#context.moveTo(wall.end.x, wall.end.y)
      this.#context.lineTo(
        wall.end.x + wall.tangent.x * 8 - wall.normal.x * 8,
        wall.end.y + wall.tangent.y * 8 - wall.normal.y * 8
      )
      this.#context.strokeStyle = '#f00'
      this.#context.stroke()

      this.#context.beginPath()
      this.#context.moveTo(wall.center.x, wall.center.y)
      this.#context.lineTo(wall.center.x - wall.normal.x * 8, wall.center.y - wall.normal.y * 8)
      this.#context.strokeStyle = '#777'
      this.#context.stroke()

      this.#context.fillStyle = '#0ff'
      this.#context.fillText(
        `d: ${wall.d.toFixed(1)}`,
        wall.center.x - wall.normal.x * 8,
        wall.center.y - wall.normal.y * 8
      )
    }
    for (const vertex of this.#level.vertices) {
      this.#context.beginPath()
      this.#context.moveTo(vertex.x, vertex.y - 4)
      this.#context.lineTo(vertex.x + 4, vertex.y)
      this.#context.lineTo(vertex.x, vertex.y + 4)
      this.#context.lineTo(vertex.x - 4, vertex.y)
      this.#context.closePath()
      this.#context.strokeStyle = '#ff0'
      this.#context.stroke()
    }
    for (const component of this.#registry.get(TransformComponent)) {
      if (!component.entity) {
        continue
      }
      const transform = component
      const body = component.entity.get('body')
      let radius = 8
      if (body) {
        radius = body.radius
      }

      this.#context.beginPath()
      this.#context.moveTo(
        transform.position.x - transform.direction.x * radius,
        transform.position.y - transform.direction.y * radius
      )
      this.#context.lineTo(
        transform.position.x + transform.direction.x * radius,
        transform.position.y + transform.direction.y * radius
      )
      this.#context.moveTo(
        transform.position.x + transform.direction.x * radius,
        transform.position.y + transform.direction.y * radius
      )
      this.#context.lineTo(
        transform.position.x - transform.direction.y * radius,
        transform.position.y + transform.direction.x * radius
      )
      this.#context.moveTo(
        transform.position.x + transform.direction.x * radius,
        transform.position.y + transform.direction.y * radius
      )
      this.#context.lineTo(
        transform.position.x + transform.direction.y * radius,
        transform.position.y - transform.direction.x * radius
      )
      this.#context.strokeStyle = '#fff'
      this.#context.stroke()

      this.#context.fillText(`${transform.position.toFixed(1)}`, transform.position.x, transform.position.y)
    }

    for (const component of this.#registry.get(ViewComponent)) {
      if (!component.entity) {
        continue
      }
      const view = component
      const transform = component.entity.get('transform')
      const body = component.entity.get('body')
      this.#context.beginPath()
      this.#context.moveTo(transform.position.x, transform.position.y)
      this.#context.lineTo(transform.position.x + view.direction.start.x, transform.position.y + view.direction.start.y)
      this.#context.arc(
        transform.position.x,
        transform.position.y,
        body.radius * 2,
        view.angle.start,
        view.angle.end
      )
      this.#context.lineTo(transform.position.x, transform.position.y)

      this.#context.strokeStyle = '#0ff'
      this.#context.stroke()

      this.#context.setLineDash([8, 8])
      for (const wall of view.walls) {
        this.#context.beginPath()
        this.#context.moveTo(wall.start.x, wall.start.y)
        this.#context.lineTo(wall.end.x, wall.end.y)

        this.#context.strokeStyle = wall.isDoubleSided ? '#777' : '#fff'
        this.#context.stroke()
      }
      this.#context.setLineDash([])

      for (const sector of view.sectors) {
        this.#context.fillStyle = '#fff'
        this.#context.fillText('R', sector.boundingBox.centerX, sector.boundingBox.centerY)
      }
    }

    this.#context.restore()
  }

  renderDebug(time) {
    this.#context.font = '16px monospace'
    this.#context.textAlign = 'left'
    this.#context.textBaseline = 'top'
    this.#context.fillStyle = '#0ff'
    this.#debug.forEach((fn, index) =>
      this.#context.fillText(fn(), 0, index * 20)
    )
  }
}
