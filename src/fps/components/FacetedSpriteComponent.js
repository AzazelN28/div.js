import EntityComponent from '../../core/EntityComponent'
import Vector2 from '../../math/Vector2'

export default class FacetedSpriteComponent extends EntityComponent {
  constructor({ entity, sources = [], pivot = 28 } = {}) {
    super(entity)
    /**
     * Imágenes que se usarán a la hora de renderizar
     * el sprite.
     *
     * @type {Array<CanvasImageSource>}
     */
    this.sources = sources
    /**
     * Pivote del sprite. Permite renderizar el sprite desplazado
     * en el eje vertical tantos píxeles como indiquemos.
     *
     * @type {number}
     */
    this.pivot = pivot
    /**
     * Voltea las imágenes en el eje horizontal
     * cuando el índice del ángulo es superior a la
     * mitad de "sources". Esto sirve para reutilizar
     * imágenes cuando representamos los sprites.
     *
     * @type {boolean}
     */
    this.isResourceful = true
    /**
     * Indica si se debe voltear en alguna dirección.
     *
     * ¡IMPORTANTE! Por algún extraño motivo (¿será por el buffer?) esto se renderiza al revés.
     *
     * @type {Vector2}
     */
    this.flip = new Vector2(0, 0)
  }
}
