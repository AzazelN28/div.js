export default class Scalar {
  static equal(a, b) {
    return a === b
  }

  static greater(a, b) {
    return a > b
  }

  static less(a, b) {
    return a < b
  }

  static greaterOrEqual(a, b) {
    return a >= b
  }

  static lessOrEqual(a, b) {
    return a <= b
  }

  static almostEqual(a, b, epsilon = 0.01) {
    return Math.abs(a - b) < epsilon
  }

  static isBetween(value, min, max) {
    return value >= min && value <= max
  }

  static add(a, b) {
    return a + b
  }

  static subtract(a, b) {
    return a - b
  }

  static multiply(a, b) {
    return a * b
  }

  static divide(a, b) {
    return a / b
  }

  constructor() {
    this.value = value
  }

  valueOf() {
    return this.value
  }

  toFixed(fractionDigits = 0) {
    return `Scalar(${this.value.toFixed(fractionDigits)})`
  }

  toString() {
    return `Scalar(${this.value})`
  }

  toJSON() {
    return this.value
  }
}
