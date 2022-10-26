import EntityComponent from '../../core/EntityComponent'
import Vector2 from '../../math/Vector2'

export default class SpriteComponent extends EntityComponent {
  constructor({ entity, source = null, pivot = 28 } = {}) {
    super(entity)
    /**
     * Imagen que vamos a utilizar a la hora de renderizar el sprite.
     *
     * @type {CanvasImageSource}
     */
    this.source = source
    /**
     * Pivote del sprite. Permite renderizar el sprite desplazado
     * en el eje vertical tantos píxeles como indiquemos.
     *
     * @type {number}
     */
    this.pivot = pivot
    
    this.flip = new Vector2()
  }
}
