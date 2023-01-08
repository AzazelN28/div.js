/**
 * @typedef {object} ResourcesConstructorOptions
 * @property {string|URL} [baseURL=location.href]
 */

/**
 * Resources
 */
export default class Resources {
  /**
   * Base URL.
   *
   * @type {string|URL}
   */
  #baseURL

  /**
   * Recursos cargados.
   *
   * @type {Map<string,*>}
   */
  #resources

  /**
   * Recursos que están cargandose.
   *
   * @type {Map<string>}
   */
  #loading

  /**
   * Errores
   *
   * @type {Map<string, Error>}
   */
  #error

  /**
   * Promesas
   *
   * @type {Map<string, Promise>}
   */
  #promises

  /**
   * Constructor
   *
   * @param {ResourcesConstructorOptions} param0
   */
  constructor({ baseURL = location.href } = {}) {
    this.#baseURL = baseURL
    this.#loading = new Map()
    this.#promises = new Map()
    this.#error = new Map()
    this.#resources = new Map()
  }

  /**
   * Número de elementos que se están cargando.
   *
   * @type {number}
   */
  get loading() {
    return this.#loading.size
  }

  /**
   * Carga o devuelve un recurso a partir de una URL.
   *
   * @param {string|URL} url
   * @returns {Promise<any, Error>}
   */
  async getOrLoad(url) {
    if (this.#resources.has(url)) {
      return this.#resources.get(url)
    }
    // Si ya tenemos un recurso cargando, no lo volvemos a cargar.
    if (this.#loading.has(url)) {
      return this.#loading.get(url)
    }
    return this.load(url)
  }

  /**
   * Devuelve un recurso ya cargado a partir de su URL.
   *
   * @param {string|URL} url
   * @returns {any}
   */
  get(url) {
    return this.#resources.get(url)
  }

  /**
   * Devuelve todos los recursos indicados.
   *
   * @param {Array<string|URL>} urls
   * @param {string|URL} baseURL
   * @returns {Array<any>}
   */
  getAll(urls, baseURL) {
    return urls.map((url) => this.#resources.get(baseURL ? baseURL + url : url))
  }

  /**
   * Devuelve si el recurso existe.
   *
   * @param {string|URL} url
   * @returns {boolean}
   */
  has(url) {
    return this.#resources.has(url)
  }

  /**
   * Guarda un recurso con la URL indicada.
   *
   * @param {string|URL} url
   * @param {any} data
   */
  set(url, data) {
    this.#resources.set(url, data)
  }

  /**
   * Borra un recurso.
   *
   * @param {string|URL} url
   */
  delete(url) {
    this.#resources.delete(url)
  }

  /**
   * Genera una secuencia de cadenas.
   *
   * NOTA: No sé si este es el lugar
   * más apropiado para esto.
   *
   * @param {string} template
   * @param {number} end
   * @param {number} [start=0]
   * @param {number} [step=1]
   * @returns {Array<string>}
   */
  sequence(template, end, start = 0, step = 1) {
    const sequence = []
    for (let index = start; index <= end; index += step) {
      sequence.push(
        template.replace(/%([A-Za-z0-9_])([0-9]+)d/g, (_, padding, count) =>
          index.toString().padStart(count, padding)
        )
      )
    }
    return sequence
  }

  /**
   * Carga una secuencia de URLs.
   *
   * @param {string} templateUrl Plantilla de URL
   * @param {number} end Final
   * @param {number} [start=0] Inicio
   * @param {number} [step=1] Paso
   * @returns {Promise}
   */
  async loadSequence(templateUrl, end, start = 0, step = 1) {
    return Promise.all(
      this.sequence(templateUrl, end, start, step)
          .map((url) => this.load(url))
    )
  }

  /**
   * Carga un recurso a partir de su URL.
   *
   * @param {string|URL} url
   * @returns {Promise<any, Error>}
   */
  async load(url) {
    this.#loading.set(url, new Promise((resolve, reject) => this.#promises.set(url, { resolve, reject })))
    try {
      // TODO: Resolver la url con el baseURL
      const parsedURL = new URL(url, this.#baseURL)
      const response = await fetch(parsedURL)
      const contentType = response.headers.get('content-type')
      const extension = parsedURL.pathname.slice(parsedURL.pathname.lastIndexOf('.'))
      if (contentType.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(extension)) {
        const blob = await response.blob()
        const blobURL = URL.createObjectURL(blob)
        const image = new Image()
        image.src = blobURL
        this.#resources.set(url, image)
      } else if (contentType.startsWith('video/') || ['.mp4', '.webm', '.ogv'].includes(extension)) {
        const blob = await response.blob()
        const blobURL = URL.createObjectURL(blob)
        const video = document.createElement('video')
        video.src = blobURL
        this.#resources.set(url, image)
      } else if (contentType.startsWith('audio/') || ['.mp3', '.wav', '.oga'].includes(extension)) {
        const audioContext = new AudioContext()
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        this.#resources.set(url, audioBuffer)
      } else if (contentType.startsWith('application/json') || ['.json'].includes(extension)) {
        const json = await response.json()
        this.#resources.set(url, json)
      } else if (contentType.startsWith('text/plain') || ['.txt', '.csv', '.tsv'].includes(extension)) {
        const text = await response.text()
        this.#resources.set(url, text)
      } else {
        const arrayBuffer = await response.arrayBuffer()
        this.#resources.set(url, arrayBuffer)
      }
      // Resolvemos la promesa pendiente.
      const promise = this.#promises.get(url)
      return promise.resolve(this.#resources.get(url))
    } catch (error) {
      this.#error.set(url, error)
    } finally {
      this.#loading.delete(url)
      this.#promises.delete(url)
    }
  }
}
