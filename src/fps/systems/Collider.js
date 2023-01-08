import EntityComponentRegistry from '../../core/EntityComponentRegistry'
import BodyComponent from '../components/BodyComponent'
import TransformComponent from '../components/TransformComponent'
import Level from '../level/Level'
import CollisionMode from './CollisionMode'

/**
 * Este sistema se encarga de comprobar las colisiones entre las entidades
 * y el nivel.
 */
export default class LevelCollider {
  /**
   * @type {Level}
   */
  #level

  /**
   * @type {EntityComponentRegistry}
   */
  #registry

  constructor({ level, registry }) {
    this.#level = level
    this.#registry = registry
  }

  update()
  {
    // Aquí actualizamos las entidades y detectamos las colisiones del
    // entorno con las entidades.
    let test = false
    // for (const entity of state.entities) {
    for (const body of this.#registry.get(BodyComponent)) {
      if (!body.entity)
        continue

      const transform = body.entity.get('transform')
      transform.position.add(body.velocity)
      transform.direction.polar(transform.rotation)

      // TODO: Aquí deberíamos comprobar si las entidades colisionan con otras entidades.
      // Esto quizá podríamos meterlo en una función llamada algo como
      // `collisionEntityEntity`.
      // TODO: Esto es muy FUERZA BRUTA, necesitamos algún tipo de
      // algoritmo que nos permita tener todo esto agrupado por áreas,
      // quizá con un boundingBox.
      for (const bodyOther of this.#registry.get(BodyComponent)) {
        if (body === bodyOther || !bodyOther.entity) {
          continue
        }
        // TODO: Esto me parece mejor modelo que el actual.
        // const transformOther = bodyOther.entity.get(TransformComponent)
        const transformOther = bodyOther.entity.get('transform')
        const distanceToOther = transform.position.distanceTo(
          transformOther.position
        )
        if (distanceToOther < body.radius + bodyOther.radius) {
          body.entities.add(bodyOther.entity)
        }
      }

      // Comprobamos si las entidades colisionan con las paredes.
      // Esto quizá podríamos meterlo en una función llamada algo como
      // `collisionEntityWall`.
      // Reseteamos la colisión con las paredes.
      body.walls.clear()

      // Si el sector es igual a -1, entonces determinamos en
      // qué sector se encuentra.
      if (body.sector === null) {
        body.sector = this.#level.getSectorAt(transform.position)
      }

      const sector = body.sector
      if (sector === null) {
        continue
      }

      if (transform.position.z > sector.floor.height) {
        body.velocity.z -= body.gravity ?? 0
        body.isOnGround = false
      } else {
        transform.position.z = sector.floor.height
        body.velocity.z = 0
        body.isOnGround = true
      }

      if (transform.position.z > sector.ceiling.height - body.height) {
        transform.position.z = sector.ceiling.height - body.height
        body.velocity.z = 0
      }

      for (const wall of sector.walls) {
        // Distancia a la línea y el centro de la entidad.
        const ld = wall.line.distance(transform.position)

        // ¡NOTA! Esto puede servir para debuggear la distancia
        // a las entidades que pueden colisionar con las paredes.
        // wall.d = ld

        // Distancia entra la línea y el radio de la entidad.
        const lpd = ld - body.radius
        // Si la distancia es mayor que 0, significa
        // que no estamos colisionando con esa pared de
        // ninguna forma.
        if (lpd > 0) {
          continue
        }

        // Asignamos a la entidad el índice
        // de la pared con la que colisionamos.
        body.walls.add(wall)

        // Si la pared tiene 2 sectores, significa que es "double-sided"
        // y que es transitable.
        if (wall.isDoubleSided && wall.isWalkable) {
          const nextSector = wall.back
          if (
            nextSector.floor.height - transform.position.z <=
            (body.stepSize ?? 0)
          ) {
            body.sector = wall.back
            if (nextSector.floor.height > transform.position.z) {
              transform.position.z = nextSector.floor.height
            }
            continue
          }
        }

        // Si la posición del objeto está FUERA del segmento.
        if (!wall.line.projected(transform.position)) {
          continue
        }

        // Dependiendo del tipo de "comportamiento" de colisión
        // reaccionamos de una forma o de otra.
        if (body.collisionMode === CollisionMode.STOP) {
          transform.position.addScale(wall.normal, lpd)
          body.velocity.reset()
          break
        } else if (body.collisionMode === CollisionMode.SLIDE) {
          transform.position.addScale(wall.normal, lpd)
          // FIXME: Esto arregla la "expulsión" del jugador fuera de los sectores pero
          // es una puta mierda.
          if (lpd > 0) {
            body.velocity.addScale(wall.normal, lpd)
          }
        } else if (body.collisionMode === CollisionMode.BOUNCE) {
          transform.position.addScale(wall.normal, lpd)
          body.velocity.negate()
          // body.velocity.add(wall.normal) // <- esto es casi mejor
        }
      }

      // Comprueba que la entidad se haya detenido.
      if (
        body.collisionMode === CollisionMode.SLIDE ||
        body.collisionMode === CollisionMode.BOUNCE
      ) {
        // TODO: Esto debería ser algo así como "muere cuando te pares" pero
        // quizá debería estar en otro lugar.
      }

      body.velocity.scale(body.friction ?? 1)
    }
  }
}
