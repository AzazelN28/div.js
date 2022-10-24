export const CollisionMode = {
  DIE: 'die',
  SLIDE: 'slide',
  BOUNCE: 'bounce'
}

export default class LevelCollider {
  #level
  #components

  constructor(level) {
    this.#level = level
    this.#components = new Set()
  }

  update()
  {
    // Aquí actualizamos las entidades y detectamos las colisiones del
    // entorno con las entidades.
    let test = false
    // for (const entity of state.entities) {
    for (const body of this.#components) {
      const transform = body.entity.get('transform')
      transform.position.add(body.velocity)

      // TODO: Aquí deberíamos comprobar si las entidades colisionan con otras entidades.
      // Esto quizá podríamos meterlo en una función llamada algo como
      // `collisionEntityEntity`.
      // TODO: Esto es muy FUERZA BRUTA, necesitamos algún tipo de
      // algoritmo que nos permita tener todo esto agrupado por áreas,
      // quizá con un boundingBox.
      /*
      for (const other of state.entities) {
        if (other === entity) {
          continue
        }
        const otherBody = state.components.bodies.get(other)
        const otherTransform = state.components.transforms.get(other)
        if (otherBody) {
          const d = vec2.distanceBetween(
            transform.position,
            otherTransform.position
          )
          if (d < body.radius + otherBody.radius) {
            // TODO: Colisión con entidad.
            test = true
          }
        }
      }
      */

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
      if (transform.position[2] > sector.floor.height) {
        body.velocity[2] -= body.gravity ?? 0
        body.onFloor = false
      } else {
        transform.position[2] = sector.floor.height
        body.velocity[2] = 0
        body.onFloor = true
      }

      if (transform.position[2] > sector.ceiling.height - body.height) {
        transform.position[2] = sector.ceiling.height - body.height
        body.velocity[2] = 0
      }

      for (const wall of sector.walls) {
        // Distancia a la línea y el centro de la entidad.
        const ld = wall.distance(transform.position)

        // Distancia entra la línea y el radio de la entidad.
        const lpd = ld - body.radius
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
            nextSector.floor.height - transform.position[2] <=
            (body.stepSize ?? 0)
          ) {
            body.sector = wall.sectors[1]
            if (nextSector.floor.height - transform.position[2] > 0) {
              transform.position[2] = nextSector.floor.height
            }
            continue
          }
        }

        // Si la posición del objeto está FUERA del segmento.
        if (!wall.projected(transform.position)) {
          continue
        }

        // Dependiendo del tipo de "comportamiento" de colisión
        // reaccionamos de una forma o de otra.
        if (body.collision === CollisionMode.DIE) {
          entity.state = EntityState.DEAD
          break
        } else if (body.collision === CollisionMode.SLIDE) {
          transform.position.addScale(wall.normal, -lpd)
          // FIXME: Esto arregla la "expulsión" del jugador fuera de los sectores pero
          // es una puta mierda.
          body.velocity.add(wall.normal)
        } else if (body.collision === CollisionMode.BOUNCE) {
          transform.position.addScale(wall.normal, -lpd)
          body.velocity.negate()
        }
      }

      // Comprueba que la entidad se haya detenido.
      if (
        body.collision === CollisionMode.SLIDE ||
        body.collision === CollisionMode.BOUNCE
      ) {
        // TODO: Esto debería ser algo así como "muere cuando te pares" pero
        // quizá debería estar en otro lugar.
        if (body.dieOnStop) {
          if (body.velocity.almostZero()) {
            entity.kill()
          }
        }
      }

      body.velocity.scale(body.friction ?? 1)
    }
  }
}
