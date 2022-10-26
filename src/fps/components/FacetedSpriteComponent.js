import EntityComponent from '../../core/EntityComponent'

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
    this.isFlipped = true
  }
}
