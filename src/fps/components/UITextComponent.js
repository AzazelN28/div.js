import EntityComponent from '../../core/EntityComponent'
import Vector2 from '../../math/Vector2'

// TODO: Aquí deberíamos definir la fuente que vamos a utilizar
// y para eso tendríamos que utilizar un <canvas> o algún otro
// elemento en el que rendericemos la textura.

export default class UITextComponent extends EntityComponent {
  /**
   * Fuente que vamos a utilizar.
   *
   * @type {string}
   */
  #font

  /**
   * Texto que debe mostrar la textura.
   *
   * @type {string}
   */
  #text
  #textStyle

  #canvas
  #context

  #size
  #pivot

  #needsUpdate = true

  constructor({ entity, text = '', font = '16px monospace' } = {}) {
    super(entity)
    this.#font = font
    this.#text = text
    this.#textStyle = '#fff'
    this.#canvas = new OffscreenCanvas(1, 1)
    this.#context = this.#canvas.getContext('2d')
    this.#needsUpdate = true
    this.#size = new Vector2(1, 1)
    this.#pivot = new Vector2(0, 0)
  }

  update() {
    console.log('update')
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    this.#context.font = this.font
    this.#context.textAlign = 'left'
    this.#context.textBaseline = 'top'

    const textMetrics = this.#context.measureText(this.#text)
    // console.log(textMetrics)

    this.#canvas.width = textMetrics.width
    this.#canvas.height = textMetrics.fontBoundingBoxDescent

    this.#context.font = this.font
    this.#context.textAlign = 'left'
    this.#context.textBaseline = 'top'

    this.#context.fillStyle = this.#textStyle
    this.#context.fillText(this.#text, 0, 0)

    this.#size.set(
      this.#canvas.width,
      this.#canvas.height
    )

    this.#needsUpdate = false
  }

  get size() {
    return this.#size
  }

  get pivot() {
    return this.#pivot
  }

  get canvas() {
    return this.#canvas
  }

  get context() {
    return this.#context
  }

  get needsUpdate() {
    return this.#needsUpdate
  }

  set font(newFont) {
    this.#font = newFont
    this.#needsUpdate = true
  }

  get font() {
    return this.#font
  }

  set text(newText) {
    this.#text = newText
    this.#needsUpdate = true
  }

  get text() {
    return this.#text
  }
}
