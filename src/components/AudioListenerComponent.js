import EntityComponent from '../core/EntityComponent'

export default class AudioListenerComponent extends EntityComponent {
  constructor({ audioContext }) {
    this.#audioContext = audioContext
  }
}
