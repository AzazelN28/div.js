export function linear(x, a, b) {
  return (1 - x) * a + x * b
}

export function quadratic(x, a, b, c) {
  return linear(x, linear(x, a, b), linear(x, b, c))
}

export function cubic(x, a, b, c, d) {
  return linear(x, quadratic(x, a, b, c), quadratic(x, b, c, d))
}

export default {
  linear,
  quadratic,
  cubic
}
