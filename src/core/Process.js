import Point from '../math/Point'
import Timer from './Timer'

export const SymbolGenerator = Symbol('process:generator')
export const SymbolIterator = Symbol('process:iterator')
export const SymbolSignal = Symbol('process:signal')
export const SymbolState = Symbol('process:state')

export const ProcessState = {
  CREATED: 'created',
  UPDATED: 'updated',
  DESTROYED: 'destroyed'
}

export const ProcessSignal = {
  NONE: null,
  KILL: 'kill',
  SLEEP: 'sleep',
  AWAKE: 'awake'
}

export default class Process {
  static create() {
    return new Process()
  }

  constructor() {
    this[SymbolState] = ProcessState.CREATED
    this[SymbolGenerator] = null
    this[SymbolIterator] = null
    this[SymbolSignal] = null
    this.timer = new Timer()
    this.position = new Point()
    this.pivot = new Point(16, 16)
    this.size = new Point(32, 32)
    this.rotation = 0
    this.scale = new Point(1, 1)
    // TODO: Estas dos propiedades deberían ir al renderable.
    this.opacity = 1
    this.compositeOperation = 'source-over'
    this.renderable = null
  }

  reset() {
    this.timer.reset()
    this.position.set(0, 0)
    this.pivot.set(16, 16)
    this.size.set(32, 32)
    this.rotation = 0
    this.scale.set(1, 1)
    this.opacity = 1
    this.compositeOperation = 'source-over'
    this.renderable = null
  }
}
