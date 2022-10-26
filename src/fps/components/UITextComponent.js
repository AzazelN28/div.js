import EntityComponent from '../../core/EntityComponent'

// TODO: Aquí deberíamos definir la fuente que vamos a utilizar
// y para eso tendríamos que utilizar un <canvas> o algún otro
// elemento en el que rendericemos la textura.

export default class UITextComponent extends EntityComponent {
  /**
   * Texto que debe mostrar la textura.
   *
   * @type {string}
   */
  #text

  #needsUpdate = true

  constructor({ entity, text = '' } = {}) {
    super(entity)
    this.#text = text
    this.#needsUpdate = true
  }

  get needsUpdate() {
    return this.#needsUpdate
  }

  set text(newText) {
    this.#text = newText
    this.#needsUpdate = true
    // TODO: Aquí deberíamos indicar de alguna forma que
    // esta textura necesita una actualización.
  }

  get text() {
    return this.#text
  }
}
