import './style.css'
import ResizeMode from './canvas/ResizeMode'
import Game from './Game'
import Vector2 from './math/Vector2'
import Line from './math/Line'
import Wall from './fps/level/Wall'
import Sector from './fps/level/Sector'
import Timer from './core/Timer'

import TransformComponent from './fps/components/TransformComponent'
import BodyComponent from './fps/components/BodyComponent'
import CollisionMode from './fps/systems/CollisionMode'
import ViewComponent from './fps/components/ViewComponent'
import FacetedSpriteComponent from './fps/components/FacetedSpriteComponent'

import AudioListenerComponent from './audio/components/AudioListenerComponent'
import AudioEmitterComponent from './audio/components/AudioEmitterComponent'
import SpriteComponent from './fps/components/SpriteComponent'
import UITextComponent from './fps/components/UITextComponent'
import UISpriteComponent from './fps/components/UISpriteComponent'
import Vector3 from './math/Vector3'

const canvas = document.querySelector('canvas')
const game = new Game({
  canvas,
  bindings: new Map([
    ['left', [
      ['keyboard', ['ArrowLeft']],
      ['gamepads', ['any', 'axis', 2, -0.125]],
    ]],
    ['right', [
      ['keyboard', ['ArrowRight']],
      ['gamepads', ['any', 'axis', 2, 0.125]],
    ]],
    ['strafeLeft', [
      ['keyboard', ['KeyA']],
      ['gamepads', ['any', 'axis', 0, -0.125]]
    ]],
    ['strafeRight', [
      ['keyboard', ['KeyD']],
      ['gamepads', ['any', 'axis', 0, 0.125]]
    ]],
    [
      'forward',
      [
        ['keyboard', ['ArrowUp']],
        ['keyboard', ['KeyW']],
        ['gamepads', ['any', 'axis', 1, -0.125]]
      ]
    ],
    [
      'backward',
      [
        ['keyboard', ['ArrowDown']],
        ['keyboard', ['KeyS']],
        ['gamepads', ['any', 'axis', 1, 0.125]]
      ]
    ],
    ['fire', [
      ['keyboard', ['KeyZ']],
      ['gamepads', ['any', 'button', 7, 0.125]]
    ]],
    ['jump', [
      ['keyboard', ['Space']],
      ['gamepads', ['any', 'button', 0, 0.125]]
    ]]
  ])
})

window.game = game

function * ExplosionBehaviour(game, parentTransform) {
  const animation = [
    '/assets/weapons/ROCKETEXP00.png',
    '/assets/weapons/ROCKETEXP01.png',
    '/assets/weapons/ROCKETEXP02.png'
  ]
  const emitter = this.set('emitter', game.registry.create(AudioEmitterComponent, {
    buffer: game.resources.get('/assets/sfx/DSBAREXP.wav'),
    start: true,
    refDistance: 128,
    maxDistance: 256
  }))
  const transform = this.set(
    'transform',
    game.registry.create(TransformComponent, {
      position: parentTransform.position.clone(),
      rotation: parentTransform.rotation
    })
  )
  const renderable = this.set(
    'renderable',
    game.registry.create(SpriteComponent, {
      source: game.resources.get('/assets/weapons/ROCKETEXP00.png')
    })
  )

  const timer = new Timer()
  let animationIndex = 0
  while (animationIndex < 2) {
    if (timer.elapsed(100)) {
      animationIndex = (animationIndex + 1) % animation.length
      renderable.source = game.resources.get(animation[animationIndex])
    }
    yield
  }
}

function * ProjectileBehaviour(game, parentTransform) {
  const transform = game.registry.create(TransformComponent)
  transform.position.copy(parentTransform.position)
  transform.rotation = parentTransform.rotation

  const body = game.registry.create(BodyComponent, {
    velocity: Vector3.fromPolar(transform.rotation, 10),
    gravity: 0,
    friction: 1
  })

  const renderable = game.registry.create(FacetedSpriteComponent, {
    sources: [
      game.resources.get('/assets/weapons/ROCKET_F.png'),
      game.resources.get('/assets/weapons/ROCKETFS.png'),
      game.resources.get('/assets/weapons/ROCKET_S.png'),
      game.resources.get('/assets/weapons/ROCKETRS.png'),
      game.resources.get('/assets/weapons/ROCKET_R.png'),
      game.resources.get('/assets/weapons/ROCKETRS.png'),
      game.resources.get('/assets/weapons/ROCKET_S.png'),
      game.resources.get('/assets/weapons/ROCKETFS.png')
    ]
  })
  renderable.flip.x = 1
  this.set('transform', transform)
  this.set('body', body)
  this.set('renderable', renderable)

  let shouldStop = false
  while (!shouldStop)
  {
    if (body.entities.size > 0) {
      for (const entity of body.entities) {
        if (entity === this.parent) {
          continue
        }
        shouldStop = true
        const bodyOther = entity.get('body')
        bodyOther.velocity.add(body.velocity)
        break
      }
    }
    if (body.walls.size > 0) {
      for (const wall of body.walls) {
        if (wall.isSingleSided) {
          shouldStop = true
          break
        }
      }
    }
    yield
  }

  game.scheduler.create('explosion', game, transform)
}

async function * LevelBehaviour(game) {
  // Retro MSDOS style
  game.setMode({ mode: ResizeMode.NONE, width: 320, height: 200 })

  // game.audio.music.play(game.resources.get('/assets/music/goof.mp3'))
  await Promise.all([
    game.resources.load('/assets/texture/SLIME15.png'),
    game.resources.load('/assets/texture/WALL30_4.png'),
    game.resources.load('/assets/texture/M1_1.png'),
    game.resources.load('/assets/texture/PLAYA1.png'),
    game.resources.load('/assets/texture/PLAYA2A8.png'),
    game.resources.load('/assets/texture/PLAYA3A7.png'),
    game.resources.load('/assets/texture/PLAYA4A6.png'),
    game.resources.load('/assets/texture/PLAYA5.png'),
    game.resources.load('/assets/weapons/HAND00.png'),
    game.resources.load('/assets/weapons/HAND01.png'),
    game.resources.load('/assets/weapons/HAND02.png'),
    game.resources.load('/assets/weapons/HAND03.png'),
    game.resources.load('/assets/weapons/CHAINSAW00.png'),
    game.resources.load('/assets/weapons/CHAINSAW01.png'),
    game.resources.load('/assets/weapons/CHAINSAW02.png'),
    game.resources.load('/assets/weapons/CHAINSAW03.png'),
    game.resources.load('/assets/weapons/PISTOL00.png'),
    game.resources.load('/assets/weapons/PISTOL01.png'),
    game.resources.load('/assets/weapons/PISTOL02.png'),
    game.resources.load('/assets/weapons/PISTOL03.png'),
    game.resources.load('/assets/weapons/PISTOL04.png'),
    game.resources.load('/assets/weapons/PISTOL05.png'),
    game.resources.load('/assets/weapons/SHOTGUN00.png'),
    game.resources.load('/assets/weapons/SHOTGUN01.png'),
    game.resources.load('/assets/weapons/SHOTGUN02.png'),
    game.resources.load('/assets/weapons/SHOTGUN03.png'),
    game.resources.load('/assets/weapons/SHOTGUN04.png'),
    game.resources.load('/assets/weapons/SHOTGUN05.png'),
    game.resources.load('/assets/weapons/SSHOTGUN00.png'),
    game.resources.load('/assets/weapons/SSHOTGUN01.png'),
    game.resources.load('/assets/weapons/SSHOTGUN02.png'),
    game.resources.load('/assets/weapons/SSHOTGUN03.png'),
    game.resources.load('/assets/weapons/SSHOTGUN04.png'),
    game.resources.load('/assets/weapons/SSHOTGUN05.png'),
    game.resources.load('/assets/weapons/SSHOTGUN06.png'),
    game.resources.load('/assets/weapons/SSHOTGUN07.png'),
    game.resources.load('/assets/weapons/SSHOTGUN08.png'),
    game.resources.load('/assets/weapons/SSHOTGUN09.png'),
    game.resources.load('/assets/weapons/CHAINGUN00.png'),
    game.resources.load('/assets/weapons/CHAINGUN01.png'),
    game.resources.load('/assets/weapons/CHAINGUN02.png'),
    game.resources.load('/assets/weapons/CHAINGUN03.png'),
    game.resources.load('/assets/weapons/ROCKETL00.png'),
    game.resources.load('/assets/weapons/ROCKETL01.png'),
    game.resources.load('/assets/weapons/ROCKETL02.png'),
    game.resources.load('/assets/weapons/ROCKETL03.png'),
    game.resources.load('/assets/weapons/ROCKETL04.png'),
    game.resources.load('/assets/weapons/ROCKETL05.png'),
    game.resources.load('/assets/weapons/ROCKET_F.png'),
    game.resources.load('/assets/weapons/ROCKETFS.png'),
    game.resources.load('/assets/weapons/ROCKET_S.png'),
    game.resources.load('/assets/weapons/ROCKETRS.png'),
    game.resources.load('/assets/weapons/ROCKET_R.png'),
    game.resources.load('/assets/weapons/ROCKETEXP00.png'),
    game.resources.load('/assets/weapons/ROCKETEXP01.png'),
    game.resources.load('/assets/weapons/ROCKETEXP02.png'),
    game.resources.load('/assets/weapons/PLASMA00.png'),
    game.resources.load('/assets/weapons/PLASMA01.png'),
    game.resources.load('/assets/weapons/PLASMA02.png'),
    game.resources.load('/assets/weapons/PLASMA03.png'),
    game.resources.load('/assets/weapons/BFG00.png'),
    game.resources.load('/assets/weapons/BFG01.png'),
    game.resources.load('/assets/weapons/BFG02.png'),
    game.resources.load('/assets/weapons/BFG03.png'),
    game.resources.load('/assets/weapons/BFG04.png'),
    game.resources.load('/assets/ambient/UB03-005 1.mp3'),
    game.resources.load('/assets/sfx/DSRLAUNC.wav'),
    game.resources.load('/assets/sfx/DSBAREXP.wav')
  ])

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
    new Vector2(192, 128)
  )
  game.level.walls.push(
    new Wall({
      line: new Line(game.level.vertices[0], game.level.vertices[1]),
      front: first
    }),
    new Wall({
      line: new Line(game.level.vertices[1], game.level.vertices[2]),
      front: first,
      back: second
    }),
    new Wall({
      line: new Line(game.level.vertices[2], game.level.vertices[3]),
      front: first
    }),
    new Wall({
      line: new Line(game.level.vertices[3], game.level.vertices[0]),
      front: first
    }),

    new Wall({
      line: new Line(game.level.vertices[4], game.level.vertices[5]),
      front: second
    }),
    new Wall({
      line: new Line(game.level.vertices[5], game.level.vertices[6]),
      front: second,
      back: third
    }),
    new Wall({
      line: new Line(game.level.vertices[6], game.level.vertices[7]),
      front: second
    }),
    new Wall({
      line: new Line(game.level.vertices[7], game.level.vertices[4]),
      front: second,
      back: first
    }),

    new Wall({
      line: new Line(game.level.vertices[8], game.level.vertices[9]),
      front: third
    }),
    new Wall({
      line: new Line(game.level.vertices[9], game.level.vertices[10]),
      front: third
    }),
    new Wall({
      line: new Line(game.level.vertices[10], game.level.vertices[11]),
      front: third
    }),
    new Wall({
      line: new Line(game.level.vertices[11], game.level.vertices[8]),
      front: third,
      back: second
    })
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

  const body = game.registry.create(BodyComponent, {
    friction: 0.95
  })
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
  const PlayerSpeed = 0.1
  const PlayerTurnSpeed = 0.1

  const weaponTimer = new Timer()

  const transform = this.set(
    'transform',
    game.registry.create(TransformComponent)
  )
  const view = this.set('view', game.registry.create(ViewComponent))
  const body = this.set(
    'body',
    game.registry.create(BodyComponent, {
      collisionMode: CollisionMode.SLIDE,
      friction: 0.95
    })
  )
  this.set('listener', game.registry.create(AudioListenerComponent))

  const weapon = game.scheduler.create('weapon', game)
  while (true)
  {
    if (game.input.stateOf('left')) {
      transform.rotation -= PlayerTurnSpeed * game.input.stateOf('left')
    } else if (game.input.stateOf('right')) {
      transform.rotation += PlayerTurnSpeed * game.input.stateOf('right')
    }

    weapon.walking = false
    if (game.input.stateOf('strafeLeft')) {
      body.velocity.addScale(transform.direction.clone().perpLeft(), PlayerSpeed * game.input.stateOf('strafeLeft'))
      weapon.walking = true
    } else if (game.input.stateOf('strafeRight')) {
      body.velocity.addScale(transform.direction.clone().perpRight(), PlayerSpeed * game.input.stateOf('strafeRight'))
      weapon.walking = true
    }

    if (game.input.stateOf('forward')) {
      body.velocity.addScale(transform.direction, PlayerSpeed * game.input.stateOf('forward'))
      weapon.walking = true
    } else if (game.input.stateOf('backward')) {
      body.velocity.addScale(transform.direction, -PlayerSpeed * game.input.stateOf('backward'))
      weapon.walking = true
    }

    if (game.input.stateOf('fire')) {
      if (weaponTimer.elapsed(500)) {
        // FIXME: Le he puesto este nombre tan "maravilloso" para
        // recordarme que esto está mal y que habría que buscar una
        // forma mejor con componentes.
        weapon.bullshit = true

        game.audio.sound.play(game.resources.get('/assets/sfx/DSRLAUNC.wav'))
        game.scheduler.create('projectile', game, transform)
      }
    }

    if (game.input.stateOf('jump') && body.isOnGround) {
      body.velocity.z = 5
    }

    // document.title = `${view.renderedWalls} ${view.renderedPlanes}`
    yield // frame;
  }
}

/**
 * Arma.
 *
 * @param {*} game
 */
function * WeaponBehaviour(game) {
  // FIXME: Esto no pué ser
  this.bullshit = false
  this.walking = false

  const weapons = [
    {
      // Mano
      sources: [
        '/assets/weapons/HAND00.png', // idle
        '/assets/weapons/HAND01.png', // shoot
        '/assets/weapons/HAND02.png',
        '/assets/weapons/HAND03.png'
      ]
    },
    {
      // Pistola
      sources: [
        '/assets/weapons/PISTOL00.png', // idle
        '/assets/weapons/PISTOL01.png', // shoot
        '/assets/weapons/PISTOL02.png',
        '/assets/weapons/PISTOL03.png',
        '/assets/weapons/PISTOL04.png',
        '/assets/weapons/PISTOL05.png',
      ]
    },
    {
      // Rocket Launcher
      sources: [
        '/assets/weapons/ROCKETL00.png', // idle
        '/assets/weapons/ROCKETL01.png', // shoot
        '/assets/weapons/ROCKETL02.png',
        '/assets/weapons/ROCKETL03.png',
        '/assets/weapons/ROCKETL04.png',
        '/assets/weapons/ROCKETL05.png'
      ]
    }
  ]

  const transform = game.registry.create(TransformComponent)
  this.set('transform', transform)

  // Cada uno de estos elementos necesita un "punto de control"
  // como en DIV para hacer que la animación salga exactamente
  // donde debe estar.
  let animationIndex = 0
  const animation = [
    '/assets/weapons/ROCKETL00.png', // idle
    '/assets/weapons/ROCKETL01.png', // shoot
    '/assets/weapons/ROCKETL02.png',
    '/assets/weapons/ROCKETL03.png',
    '/assets/weapons/ROCKETL04.png',
    '/assets/weapons/ROCKETL05.png',
  ]
  const renderable = game.registry.create(UISpriteComponent, {
    source: game.resources.get('/assets/weapons/ROCKETL00.png')
  })
  renderable.autoPivot = true
  this.set('renderable', renderable)

  const timer = new Timer()
  transform.position.x = 160
  transform.position.y = 240
  while (true) {
    if (this.walking) {
      transform.position.x = 160 + Math.sin(Date.now() / 500) * 20
      transform.position.y = 240 + Math.abs(Math.cos(Date.now() / 500) * 10)
    } else {
      transform.position.x = 160
      transform.position.y = 240
    }
    if (timer.elapsed(1000 / 30) && this.bullshit === true) {
      animationIndex = (animationIndex + 1) % animation.length
      if (animationIndex === 0) {
        this.bullshit = false
      }
      const source = game.resources.get(animation[animationIndex])
      renderable.source = source
      // Es importante actualizar el tamaño después de cambiar el source
      // porque si no se renderiza con el tamaño original del primer
      // source.
      renderable.size.set(source.width, source.height)
    }
    yield
  }
}

game.scheduler.register('level', LevelBehaviour)
game.scheduler.register('enemy', EnemyBehaviour)
game.scheduler.register('player', PlayerBehaviour)
game.scheduler.register('projectile', ProjectileBehaviour)
game.scheduler.register('weapon', WeaponBehaviour)
game.scheduler.register('explosion', ExplosionBehaviour)

game.scheduler.create('level', game)

game.start()
