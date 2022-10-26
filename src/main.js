import './style.css'
import ResizeMode from './canvas/ResizeMode'
import Game from './Game'
import Vector2 from './math/Vector2'
import Line from './math/Line'
import Wall from './fps/level/Wall'
import Sector from './fps/level/Sector'

import TransformComponent from './fps/components/TransformComponent'
import BodyComponent from './fps/components/BodyComponent'
import { CollisionMode } from './fps/systems/Collider'
import ViewComponent from './fps/components/ViewComponent'
import FacetedSpriteComponent from './fps/components/FacetedSpriteComponent'

import AudioListenerComponent from './audio/components/AudioListenerComponent'
import AudioEmitterComponent from './audio/components/AudioEmitterComponent'
import SpriteComponent from './fps/components/SpriteComponent'

const canvas = document.querySelector('canvas')
const game = new Game({
  canvas,
  bindings: new Map([
    ['left', [['keyboard', ['ArrowLeft']]]],
    ['right', [['keyboard', ['ArrowRight']]]],
    ['strafeLeft', [['keyboard', ['KeyA']]]],
    ['strafeRight', [['keyboard', ['KeyD']]]],
    [
      'forward',
      [
        ['keyboard', ['ArrowUp']],
        ['keyboard', ['KeyW']]
      ]
    ],
    [
      'backward',
      [
        ['keyboard', ['ArrowDown']],
        ['keyboard', ['KeyS']]
      ]
    ],
    ['fire', [['keyboard', ['KeyZ']]]],
    ['jump', [['keyboard', ['Space']]]]
  ])
})

window.game = game

function * ProjectileBehaviour(game, parentTransform) {
  const transform = game.registry.create(TransformComponent)
  transform.position.copy(parentTransform.position)
  transform.rotation = parentTransform.rotation

  const body = game.registry.create(BodyComponent)
  body.collisionMode = CollisionMode.STOP

  const renderable = game.registry.create(SpriteComponent, {
    source: game.resources.get('/assets/texture/SLIME15.png')
  })
  this.set('transform', transform)
  this.set('body', body)
  this.set('renderable', renderable)

  body.friction = 1
  body.velocity.x = Math.cos(transform.rotation) * 10
  body.velocity.y = Math.sin(transform.rotation) * 10
  while (body.walls.size == 0)
  {
    yield
  }
}

async function * LevelBehaviour(game) {
  await game.resources.load('/assets/music/goof.mp3')
  game.audio.music.play(game.resources.get('/assets/music/goof.mp3'))
  await game.resources.load('/assets/texture/SLIME15.png')
  await game.resources.load('/assets/texture/WALL30_4.png')
  await game.resources.load('/assets/texture/M1_1.png')
  await game.resources.load('/assets/texture/PLAYA1.png')
  await game.resources.load('/assets/texture/PLAYA2A8.png')
  await game.resources.load('/assets/texture/PLAYA3A7.png')
  await game.resources.load('/assets/texture/PLAYA4A6.png')
  await game.resources.load('/assets/texture/PLAYA5.png')
  await game.resources.load('/assets/ambient/UB03-005 1.mp3')


  // Retro MSDOS style
  game.setMode({ mode: ResizeMode.NONE, width: 320, height: 200 })
  // game.setMode({ mode: ResizeMode.FILL, scale: 0.5 })
  const first = new Sector()
  const second = new Sector()
  const third = new Sector()
  game.level.vertices.push(
    new Vector2(-64, -64),
    new Vector2(64, -64),
    new Vector2(64, 64),
    new Vector2(-64, 64),

    new Vector2(64, -64),
    new Vector2(192, -128),
    new Vector2(192, 128),
    new Vector2(64, 64),

    new Vector2(192, -128),
    new Vector2(320, -128),
    new Vector2(320, 128),
    new Vector2(192, 128),
  )
  game.level.walls.push(
    new Wall({ line: new Line(game.level.vertices[0], game.level.vertices[1]), front: first }),
    new Wall({ line: new Line(game.level.vertices[1], game.level.vertices[2]), front: first, back: second }),
    new Wall({ line: new Line(game.level.vertices[2], game.level.vertices[3]), front: first }),
    new Wall({ line: new Line(game.level.vertices[3], game.level.vertices[0]), front: first }),

    new Wall({ line: new Line(game.level.vertices[4], game.level.vertices[5]), front: second }),
    new Wall({ line: new Line(game.level.vertices[5], game.level.vertices[6]), front: second, back: third }),
    new Wall({ line: new Line(game.level.vertices[6], game.level.vertices[7]), front: second }),
    new Wall({ line: new Line(game.level.vertices[7], game.level.vertices[4]), front: second, back: first }),

    new Wall({ line: new Line(game.level.vertices[8], game.level.vertices[9]), front: third }),
    new Wall({ line: new Line(game.level.vertices[9], game.level.vertices[10]), front: third }),
    new Wall({ line: new Line(game.level.vertices[10], game.level.vertices[11]), front: third }),
    new Wall({ line: new Line(game.level.vertices[11], game.level.vertices[8]), front: third, back: second }),
  )
  first.walls = [
    game.level.walls[0],
    game.level.walls[1],
    game.level.walls[2],
    game.level.walls[3]
  ]
  first.floor.height = 8
  first.ceiling.height = 64
  second.walls = [
    game.level.walls[4],
    game.level.walls[5],
    game.level.walls[6],
    game.level.walls[7]
  ]
  second.floor.height = 4
  second.ceiling.height = 72
  third.walls = [
    game.level.walls[8],
    game.level.walls[9],
    game.level.walls[10],
    game.level.walls[11]
  ]
  third.floor.height = 0
  third.ceiling.height = 96

  game.level.walls[1].middle.texture = '/assets/texture/M1_1.png'
  game.level.walls[5].middle.texture = '/assets/texture/M1_1.png'
  game.level.walls[7].middle.texture = '/assets/texture/M1_1.png'
  game.level.walls[11].middle.texture = '/assets/texture/M1_1.png'

  game.level.sectors.push(first, second, third)
  game.level.compute()

  game.scheduler.create('enemy', game)
  game.scheduler.create('enemy', game, 64, 64)
  game.scheduler.create('enemy', game, 128, 64)
  game.scheduler.create('player', game)

  while (true) {
    yield // frame;
  }
}

function * EnemyBehaviour(game, x = 0, y = 0) {
  const transform = game.registry.create(TransformComponent)
  transform.position.x = x
  transform.position.y = y

  const body = game.registry.create(BodyComponent)
  const renderable = game.registry.create(FacetedSpriteComponent, {
    sources: [
      game.resources.get('/assets/texture/PLAYA1.png'),
      game.resources.get('/assets/texture/PLAYA2A8.png'),
      game.resources.get('/assets/texture/PLAYA3A7.png'),
      game.resources.get('/assets/texture/PLAYA4A6.png'),
      game.resources.get('/assets/texture/PLAYA5.png'),
      game.resources.get('/assets/texture/PLAYA4A6.png'),
      game.resources.get('/assets/texture/PLAYA3A7.png'),
      game.resources.get('/assets/texture/PLAYA2A8.png')
    ]
  })
  const emitter = game.registry.create(AudioEmitterComponent, {
    buffer: game.resources.get('/assets/ambient/UB03-005 1.mp3'),
    start: true,
    loop: true
  })
  this.set('transform', transform)
  this.set('body', body)
  this.set('renderable', renderable)
  this.set('emitter', emitter)

  body.velocity.x = 1
  while (true)
  {
    yield // frame;
  }
}

function * PlayerBehaviour(game) {
  const transform = game.registry.create(TransformComponent)
  this.set('transform', transform)
  const body = game.registry.create(BodyComponent)
  body.collisionMode = CollisionMode.SLIDE
  this.set('view', game.registry.create(ViewComponent))
  this.set('body', body)
  this.set('listener', game.registry.create(AudioListenerComponent))

  while (true)
  {
    if (game.input.stateOf('left')) {
      transform.rotation -= 0.1
    } else if (game.input.stateOf('right')) {
      transform.rotation += 0.1
    }

    if (game.input.stateOf('strafeLeft')) {
      body.velocity.addScale(transform.direction.clone().perpLeft(), 0.1)
    } else if (game.input.stateOf('strafeRight')) {
      body.velocity.addScale(transform.direction.clone().perpRight(), 0.1)
    }

    if (game.input.stateOf('forward')) {
      body.velocity.addScale(transform.direction, 0.1)
    } else if (game.input.stateOf('backward')) {
      body.velocity.addScale(transform.direction, -0.1)
    }

    if (game.input.stateOf('fire')) {
      game.scheduler.create('projectile', game, transform)
    }

    if (game.input.stateOf('jump') && body.isOnGround) {
      body.velocity.z = 5
    }
    yield // frame;
  }
}

game.scheduler.register('level', LevelBehaviour)
game.scheduler.register('enemy', EnemyBehaviour)
game.scheduler.register('player', PlayerBehaviour)
game.scheduler.register('projectile', ProjectileBehaviour)

game.scheduler.create('level', game)

game.start()
