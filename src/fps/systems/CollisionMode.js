/**
 * Modo de colisión.
 *
 * @readonly
 * @enum {string}
 */
export const CollisionMode = {
  /**
   * Cuando la entidad choca contra algo se detiene.
   */
  STOP: 'stop',
  /**
   * Cuando la entidad choca contra algo se desliza.
   */
  SLIDE: 'slide',
  /**
   * Cuando la entidad choca contra algo rebota.
   */
  BOUNCE: 'bounce'
}

export default CollisionMode
