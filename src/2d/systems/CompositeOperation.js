/**
 * Operaciones de composición
 *
 * @readonly
 * @enum {string}
 */
export const CompositeOperation = {
  /** This is the default setting and draws new shapes on top of the existing canvas content. */
  SOURCE_OVER: 'source-over',
  /** The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent. */
  SOURCE_IN: 'source-in',
  /** The new shape is drawn where it doesn't overlap the existing canvas content. */
  SOURCE_OUT: 'source-out',
  /** The new shape is only drawn where it overlaps the existing canvas content. */
  SOURCE_ATOP: 'source-atop',
  /** New shapes are drawn behind the existing canvas content. */
  DESTINATION_OVER: 'destination-over',
  /** The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent. */
  DESTINATION_IN: 'destination-in',
  /** The existing content is kept where it doesn't overlap the new shape. */
  DESTINATION_OUT: 'destination-out',
  /** The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content. */
  DESTINATION_ATOP: 'destination-atop',
  /** Where both shapes overlap the color is determined by adding color values. */
  LIGHTER: 'lighter',
  /** Only the new shape is shown. */
  COPY: 'copy',
  /** Shapes are made transparent where both overlap and drawn normal everywhere else. */
  XOR: 'xor',
  /** The pixels of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result. */
  MULTIPLY: 'multiply',
  /** The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply) */
  SCREEN: 'screen',
  /** A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter. */
  OVERLAY: 'overlay',
  /** Retains the darkest pixels of both layers. */
  DARKEN: 'darken',
  /** Retains the lightest pixels of both layers. */
  LIGHTEN: 'lighten',
  /** Divides the bottom layer by the inverted top layer. */
  COLOR_DODGE: 'color-dodge',
  /** Divides the inverted bottom layer by the top layer, and then inverts the result. */
  COLOR_BURN: 'color-burn',
  /** A combination of multiply and screen like overlay, but with top and bottom layer swapped. */
  HARD_LIGHT: 'hard-light',
  /** A softer version of hard-light. Pure black or white does not result in pure black or white. */
  SOFT_LIGHT: 'soft-light',
  /** Subtracts the bottom layer from the top layer or the other way round to always get a positive value. */
  DIFFERENCE: 'difference',
  /** Like difference, but with lower contrast. */
  EXCLUSION: 'exclusion',
  /** Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer. */
  HUE: 'hue',
  /** Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer. */
  SATURATION: 'saturation',
  /** Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer. */
  COLOR: 'color',
  /** Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer. */
  LUMINOSITY: 'luminosity'
}

export default CompositeOperation
