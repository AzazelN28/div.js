import './style.css'
import Point from './math/Point'
import ResizeMode from './canvas/ResizeMode'
import Game from './Game'
import Timer from './core/Timer'
import Random from './math/Random'
import Rect from './math/Rect'

const canvas = document.querySelector('canvas')
const game = new Game({
  canvas,
  bindings: new Map([
    ['left', [['keyboard', ['ArrowLeft']]]],
    ['right', [['keyboard', ['ArrowRight']]]],
    ['up', [['keyboard', ['ArrowUp']]]],
    ['down', [['keyboard', ['ArrowDown']]]],
    ['fire', [['keyboard', ['Space']]]],
  ])
})
game.start()

window.game = game

function * ProjectileExplosionBehaviour(game, x, y) {
  const renderable = game.renderer.createSpritesheet({
    source: game.resources.get('/assets/explosion-4x.png'),
    width: 64,
    height: 64,
    totalFrames: 16
  })

  renderable.size.set(64, 64)
  renderable.pivot.copy(renderable.size).scale(0.5)
  renderable.compositeOperation = 'lighten'

  this.set('renderable', renderable)

  const transform = this.get('transform')
  transform.position.set(x, y)

  while (!renderable.animate()) {
    renderable.opacity = 1.0 - renderable.progress
    yield
  }
}

function * ProjectileBehaviour(game, x, y) {
  const collidable = game.collider.createRect({
    rect: new Rect(new Point(-8, -18), new Point(16, 36))
  })
  this.set('collidable', collidable)

  const renderable = game.renderer.createSprite({
    source: game.resources.get('/assets/player-shot.png')
  })
  renderable.size.set(16, 36)
  renderable.pivot.copy(renderable.size).scale(0.5)
  this.set('renderable', renderable)

  /*
  const collidableRenderable = game.renderer.createRect({
    stroke: '#0ff',
    rect: collidable.rect
  })
  this.set('collidable-renderable', collidableRenderable)
  */

  const transform = this.get('transform')
  transform.position.set(x, y)

  let explode = false
  while (transform.position.y > 0) {
    const collisions = collidable.hasCollidedWith('enemy')
    if (collisions.length) {
      explode = true
      break
    }
    transform.position.y -= 10
    yield // frame;
  }

  this.delete('collidable')

  if (explode) {
    game.scheduler.create('projectile-explosion', game, transform.position.x, transform.position.y)
  }

  game.renderer.destroyComponent(renderable)
}

function * EnemyBehaviour(game) {
  const collidable = game.collider.createRect({
    rect: new Rect(new Point(-64, -64), new Point(128, 128))
  })
  this.set('collidable', collidable)

  const renderable = game.renderer.createSpritesheet({
    source: game.resources.get('/assets/enemy.png'),
    width: 256,
    height: 256,
    totalFrames: 6
  })
  renderable.size.set(256, 256)
  renderable.pivot.copy(renderable.size).scale(0.5)
  this.set('renderable', renderable)

  /*
  const collidableRenderable = game.renderer.createRect({
    stroke: '#f0f',
    rect: collidable.rect
  })
  this.set('collidable-renderable', collidableRenderable)
  */

  let health = 10

  const transform = this.get('transform')
  transform.position.set(
    Math.random() * game.viewport.width,
    -128
  )

  while (transform.position.y < game.viewport.height + 128 && health > 0) {
    const collisions = collidable.hasCollidedWith('projectile')
    if (collisions) {
      for (const entity of collisions) {
        health--
      }
    }

    // TODO: Las animaciones pueden ser "rangos" en los que tenemos
    // un fotograma inicial y un fotograma inicial.
    // Esta función podría llamarse `animatable.animate('idle')` y que
    // cada "animación" tenga un nombre.
    renderable.animate()
    transform.position.y++
    yield // frame;
  }

  if (health <= 0) {
    // Aquí podríamos reproducir la animación
    // de explosión.
    for (let i = 0; i < 10; i++) {
      transform.scale.x += 0.1
      transform.scale.y += 0.1
      renderable.opacity -= 0.1
      yield // frame;
    }

    // Reproducimos el sonido de explosión.
    game.audio.sound.play(game.resources.get('/assets/explosion.wav'), {
      offset: 0.2,
      playbackRate: Random.between(0.9, 1.1),
      detune: Random.between(0.7, 1.3)
    })
  }

  game.renderer.destroyComponent(renderable)
}

async function * LoaderBehaviour(game) {
  const transform = this.get('transform')
  transform.position.set(game.viewport.rect.centerX, game.viewport.rect.centerY)

  const renderable = game.renderer.createSprite({
    source: game.resources.get('/assets/loader.png')
  })
  this.set('renderable', renderable)
  while (true) {
    transform.rotation += 0.1
    yield
  }

  game.renderer.destroyComponent(renderable)
}

async function * LevelBehaviour(game) {
  game.setMode({ mode: ResizeMode.NONE, width: 1280, height: 800 })

  const timer = new Timer()

  const renderable = game.renderer.createRect({
    rect: game.viewport.rect,
    fill: '#181425'
  })
  this.set('renderable', renderable)

  await game.resources.load('/assets/loader.png')

  const _loader = game.scheduler.create('loader', game)

  // Aquí realizamos la carga de los recursos del juego.
  await game.resources.load('/assets/shot.wav')
  await game.resources.load('/assets/explosion.wav')
  await game.resources.load('/assets/explosion-4x.png')
  await game.resources.load('/assets/player.png')
  await game.resources.load('/assets/enemy.png')
  await game.resources.load('/assets/player-shot.png')
  await game.resources.load('/assets/enemy-shot.png')

  _loader.destroy()

  const _player = game.scheduler.create('player', game)
  game.renderer.debug.push(() => _player.get('transform').position.toFixed(2))
  game.renderer.debug.push(() => game.scheduler.get('projectile').size)
  game.renderer.debug.push(() => game.scheduler.get('projectile-explosion').size)
  game.renderer.debug.push(() => game.scheduler.get('enemy').size)
  game.renderer.debug.push(() => game.scheduler.get('player').size)

  while (true) {
    if (game.input.keyboard.isPressed('KeyP')) {
      _player.suspend(true)
    } else if (game.input.keyboard.isPressed('KeyR')) {
      _player.resume(true)
    }

    if (timer.elapsed(2000)) {
      game.scheduler.create('enemy', game)
    }
    yield // frame;
  }

  game.renderer.destroyComponent(renderable)
}

function * PlayerBehaviour (game) {
  const velocity = new Point()
  const weaponTimer = new Timer()

  const transform = this.get('transform')
  transform.position.set(game.viewport.rect.centerX, game.viewport.rect.centerY)

  const renderable = game.renderer.createSpritesheet({
    source: game.resources.get('/assets/player.png'),
    width: 128,
    height: 164,
    totalFrames: 9
  })

  renderable.size.set(128, 164)
  renderable.pivot.copy(renderable.size).scale(0.5)

  this.set('renderable', renderable)
  while (true) {
    if (game.input.stateOf('left')) {
      velocity.x--
    } else if (game.input.stateOf('right')) {
      velocity.x++
    }

    if (game.input.stateOf('up')) {
      velocity.y--
    } else if (game.input.stateOf('down')) {
      velocity.y++
    }

    if (game.input.stateOf('fire')) {
      if (weaponTimer.elapsed(100)) {
        game.audio.sound.play(game.resources.get('/assets/shot.wav'), {
          playbackRate: Random.between(0.9, 1.1) ,
          detune: Random.between(0.9, 1.1)
        })
        game.scheduler.create('projectile', game, transform.position.x, transform.position.y - 32)
      }
    }
    renderable.animate()

    transform.position.add(velocity)
    transform.position.constrainTo(game.viewport.rect)

    velocity.scale(0.9)
    yield // frame;
  }

  game.renderer.destroyComponent(renderable)
}

game.scheduler.register('loader', LoaderBehaviour)
game.scheduler.register('enemy', EnemyBehaviour)
game.scheduler.register('level', LevelBehaviour)
game.scheduler.register('projectile', ProjectileBehaviour)
game.scheduler.register('projectile-explosion', ProjectileExplosionBehaviour)
game.scheduler.register('player', PlayerBehaviour)

game.scheduler.create('level', game)
