import ViewComponent from '../components/ViewComponent'

export default class Visibility {
  #registry

  constructor ({ registry }) {
    this.#registry = registry
  }

  update() {
    for (const view of this.#registry.get(ViewComponent)) {
      if (view.entity == null) {
        continue
      }

      const transform = view.entity.get('transform')
      const body = view.entity.get('body')

      ////////////////////////////////////////////////////////////////////////////
      //
      // Esta parte se encarga de actualizar la vista.
      //
      // Aquí lo que vamos a hacer es: utilizando la dirección actual del
      // jugador, su posición (en qué sector se encuentra) y las paredes de ese
      // sector, trazamos todos los sectores visibles.
      //
      ////////////////////////////////////////////////////////////////////////////
      view.sectors.clear()
      view.walls.clear()

      view.angle.start = transform.rotation - view.fieldOfView * 0.5
      view.angle.end = transform.rotation + view.fieldOfView * 0.5

      view.direction.start.polar(view.angle.start)
      view.direction.end.polar(view.angle.end)

      const MAX_VISITED_SECTORS = 128
      if (!body.sector)
        continue

      // Esta parte se encarga de mantener una lista de
      // sectores y paredes visibles actualizada.
      const visit = [body.sector]
      const visited = new Set()
      while (visit.length > 0) {
        // Si visitamos más sectores de los que es recomendable,
        // salimos del bucle.
        if (visited.size >= MAX_VISITED_SECTORS) {
          break
        }
        const sector = visit.pop()
        visited.add(sector)
        view.sectors.add(sector)

        for (const wall of sector.walls) {
          const start = wall.start.clone()
          const end = wall.end.clone()
          start.subtract(transform.position)
          end.subtract(transform.position)
          // Esto es lo suficientemente bueno como para
          // mantener la lista de paredes visibles
          // actualizada medianamente bien.
          const n = transform.direction.dot(wall.normal)
          const sdp = transform.direction.dot(start)
          const edp = transform.direction.dot(end)
          if (sdp < 0 && edp < 0 && n < 0) {
            continue
          }
          view.walls.add(wall)

          // Si la pared de este sector es un portal
          // entonces añadimos el sector del "otro lado"
          // a la lista de sectores que debemos visitar.
          if (
            wall.isDoubleSided &&
            !visit.includes(wall.back) &&
            !visited.has(wall.back)
          ) {
            visit.push(wall.back)
          }
        }
      }
    }
  }
}
