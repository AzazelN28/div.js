import Rect from '../../math/Rect'
import EntityComponent from '../../core/EntityComponent'
import { TaskTypeSymbol } from '../../core/Task'

export class ColliderRectComponent extends EntityComponent {
  #rect = new Rect()
  #collisions = new Set()

  constructor({ entity, rect = new Rect() } = {}) {
    super(entity)
    this.#rect = rect
  }

  hasCollidedWith(type) {
    const collisions = Array.from(this.#collisions)
    return collisions
      .filter((collision) => collision.entity && collision.entity[TaskTypeSymbol] === type)
      .map((collision) => collision.entity)
  }

  get hasCollided() {
    return this.#collisions.size > 0
  }

  get collisions() {
    return this.#collisions
  }

  get rect() {
    return this.#rect
  }
}

export default class Collider {
  #components = new Set()

  createComponent(constructor, ...args) {
    const component = new constructor(...args)
    component.system = this
    this.#components.add(component)
    return component
  }

  destroyComponent() {
    component.entity = null
    return this.#components.delete(component)
  }

  createRect(...args) {
    return this.createComponent(ColliderRectComponent, ...args)
  }

  update() {
    const aRect = new Rect()
    const bRect = new Rect()
    const components = Array.from(this.#components)
    // Limpiamos las colisiones del fotograma anterior.
    components.forEach((component) => component.collisions.clear())
    // Recorremos la lista de rectángulos para comprobar
    // si alguno ha colisionado con otro.
    for (let ai = 0; ai < components.length - 1; ai++) {
      const a = components[ai]
      if (!a.entity) {
        continue
      }

      const aTransform = a.entity.get('transform')
      aRect.copy(a.rect)
      aRect.position.multiply(aTransform.scale)
      aRect.size.multiply(aTransform.scale)
      aRect.position.add(aTransform.position)

      for (let bi = ai + 1; bi < components.length; bi++) {
        const b = components[bi]
        if (!b.entity || b.collisions.has(a)) {
          continue
        }

        const bTransform = b.entity.get('transform')
        bRect.copy(b.rect)
        bRect.position.multiply(bTransform.scale)
        bRect.size.multiply(bTransform.scale)
        bRect.position.add(bTransform.position)

        if (aRect.intersects(bRect)) {
          // debugger
          a.collisions.add(b)
          b.collisions.add(a)
        }
      }
    }
  }
}
