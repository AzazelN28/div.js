import './style.css'
import Process from './core/Process'
import Point from './math/Point'
import ResizeMode from './canvas/ResizeMode'
import RenderableSpritesheet from './renderer/RenderableSpritesheet'
import Game from './Game'
import Timer from './core/Timer'
import RenderableRect from './renderer/RenderableRect'

const canvas = document.querySelector('canvas')
const game = new Game({ canvas })
game.start()

window.game = game

function * ProjectileBehaviour(game, x, y) {
  this.renderable = game.resources.get('/assets/player-shot.png')
  this.size.set(16, 36)
  this.pivot.copy(this.size).scale(0.5)
  this.position.set(x, y)
  while (this.position.y > 0) {
    this.position.y -= 10
    yield // frame;
  }
}

function * EnemyBehaviour(game) {
  this.renderable = new RenderableSpritesheet({
    source: game.resources.get('/assets/enemy.png'),
    width: 256,
    height: 256,
    totalFrames: 6
  })
  this.size.set(256, 256)
  this.pivot.copy(this.size).scale(0.5)
  this.health = 10
  this.position.set(
    Math.random() * game.resize.width,
    -128
  )

  while (this.position.y < game.resize.height + 32 && this.health > 0) {
    // TODO: Creo que esto es lo que está produciendo TODOS los problemas.
    for (const projectile of game.core.get(ProjectileBehaviour)) {
      if (
        Math.abs(projectile.position.x - this.position.x) < this.pivot.x &&
        Math.abs(projectile.position.y - this.position.y) < this.pivot.y
      ) {
        // TODO: ESTA NO ES LA FORMA DE HACER LAS COSAS ¯\_(ツ)_/¯

        // YA ENTIENDO LO QUE PASA CON ESTO:

        // 1. Se crean un proyectil
        // 2. Se procesa un enemigo que está el esquina, así que como el proyectil
        //    todavía no ha actualizado sus atributos (porque no ha sido ejecutado
        //    ninguna vez) tiene las coordenadas 0,0.
        // 3. El código pasa por aquí, porque estamos procesando un enemigo.
        // 4. El proyectil se destruye.
        // 5. Ejecutamos lo que haya en los iteradores.

        game.core.kill(projectile)
        this.health--
      }
    }
    this.renderable.animate()
    this.position.y++
    yield // frame;
  }

  if (this.health <= 0) {
    for (let i = 0; i < 10; i++) {
      this.scale.x += 0.1
      this.scale.y += 0.1
      this.opacity -= 0.1
      yield // frame;
    }
  }
}

async function * LoaderBehaviour(game) {
  this.renderable = game.resources.get('/assets/loader.png')
  this.position.set(game.resize.rect.centerX, game.resize.rect.centerY)
  while (true) {
    this.rotation += 0.1
    yield
  }
}

async function * LevelBehaviour(game) {
  game.setMode({ mode: ResizeMode.NONE, width: 1280, height: 800 })

  this.renderable = new RenderableRect({
    rect: game.resize.rect,
    fill: '#181425'
  })

  await game.resources.load('/assets/loader.png')

  const _loader = loader(game)

  // Aquí realizamos la carga de los recursos del juego.
  await game.resources.load('/assets/player.png')
  await game.resources.load('/assets/enemy.png')
  await game.resources.load('/assets/player-shot.png')
  await game.resources.load('/assets/enemy-shot.png')

  // Matamos el loading.
  game.core.kill(_loader)

  const _player = player(game)
  game.renderer.debug.push(() => _player.position.toFixed(2))
  game.renderer.debug.push(() => `count: ${game.pool.count}, available: ${game.pool.available}, size: ${game.pool.size}, index: ${game.pool.index}`)
  game.renderer.debug.push(() => game.core.get(ProjectileBehaviour).length)
  game.renderer.debug.push(() => game.core.get(EnemyBehaviour).length)
  game.renderer.debug.push(() => game.core.get(PlayerBehaviour).length)

  while (true) {
    if (this.timer.elapsed(2000)) {
      enemy(game)
    }
    yield // frame;
  }
}

function * PlayerBehaviour (game) {
  this.position.set(game.resize.rect.centerX, game.resize.rect.centerY)
  this.size.set(128, 164)
  this.pivot.copy(this.size).scale(0.5)
  this.renderable = new RenderableSpritesheet({
    source: game.resources.get('/assets/player.png'),
    width: 128,
    height: 164,
    totalFrames: 9
  })
  while (true) {
    if (game.keyboard.isPressed('ArrowLeft')) {
      this.velocity.x--
    } else if (game.keyboard.isPressed('ArrowRight')) {
      this.velocity.x++
    }
    if (game.keyboard.isPressed('ArrowUp')) {
      this.velocity.y--
    } else if (game.keyboard.isPressed('ArrowDown')) {
      this.velocity.y++
    }
    if (true) {
      if (this.weaponTimer.elapsed(100)) {
        projectile(game, this.position.x, this.position.y - 32)
      }
    }
    this.renderable.animate()
    this.position.add(this.velocity)
    this.position.constrainTo(game.resize.rect)
    this.velocity.scale(0.9)
    yield // frame;
  }
}

class PlayerProcess extends Process {
  constructor() {
    super()
    this.velocity = new Point()
    this.weaponTimer = new Timer()
  }
}

const loader = game.core.define(LoaderBehaviour)
const enemy = game.core.define(EnemyBehaviour)
const level = game.core.define(LevelBehaviour)
const projectile = game.core.define(ProjectileBehaviour)
const player = game.core.define(PlayerBehaviour, () => new PlayerProcess())

level(game)
