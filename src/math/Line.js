import Scalar from './Scalar.js'
import Interpolation from './Interpolation.js'
import Vector2 from './Vector2.js'

export default class Line {
  constructor(start = new Vector2(), end = new Vector2()) {
    this.start = start
    this.end = end
  }

  get length() {
    return Math.hypot(this.dx, this.dy)
  }

  get lengthSquared() {
    return this.dx * this.dx + this.dy * this.dy
  }

  get sx() {
    return this.start.x
  }

  get sy() {
    return this.start.y
  }

  get ex() {
    return this.end.x
  }

  get ey() {
    return this.end.y
  }

  get dx() {
    return this.ex - this.sx
  }

  get dy() {
    return this.ey - this.sy
  }

  side({ x, y }) {
    const { sx, sy, dx, dy } = this
    return dx * (y - sy) - dy * (x - sx)
  }

  distance({ x, y }) {
    return this.side({ x, y }) / this.length
  }

  projection({ x, y }) {
    const { sx, sy, dx, dy, lengthSquared } = this
    const dot = (x - sx) * dx + (y - sy) * dy
    let param = -1
    if (lengthSquared != 0) {
      param = dot / lengthSquared
    }
    return param
  }

  projected(point, { min = -0.25, max = 1.25 } = {}) {
    const param = this.projection(point)
    return param >= min && param <= max
  }

  denominator(a, b) {
    // return (ax - bx) * (cy - dy) - (ay - by) * (cx - dx)
    return a.dx * b.dy - a.dy * b.dx
  }

  intersection(a, b, out = new Vector2()) {
    const denom = this.denominator(a, b)
    if (Scalar.almostEqual(denom, 0)) {
      return out.set(Infinity, Infinity)
    }

    const { sx: ax, sy: ay, ex: bx, ey: by } = a
    const { sx: cx, sy: cy, ex: dx, ey: dy } = b

    const u = ((ax - cx) * (cy - dy) - (ay - cy) * (cx - dx)) / denom
    const v = ((ax - cx) * (ay - by) - (ay - cy) * (ax - bx)) / denom

    if (Number.isFinite(u) && Scalar.isBetween(u, 0, 1)) {
      return out.set(
        Interpolation.linear(u, ax, bx),
        Interpolation.linear(u, ay, by)
      )
    } else if (Number.isFinite(v) && Scalar.isBetween(v, 0, 1)) {
      return out.set(
        Interpolation.linear(v, cx, dx),
        Interpolation.linear(v, cy, dy)
      )
    }
    return out.set(Infinity, Infinity)
  }
}
