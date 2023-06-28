import './style.css'
import ResizeMode from './canvas/ResizeMode'
import Game from './Game'
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
  const animation = game.resources.sequence('/assets/weapons/ROCKETEXP%02d.png', 2)
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
  transform.position.z += 16
  transform.rotation = parentTransform.rotation

  const body = game.registry.create(BodyComponent, {
    velocity: Vector3.fromPolar(transform.rotation, 10),
    stepSize: 0,
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
  this.set('body', body)
  this.set('transform', transform)
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
        } else if (wall.isDoubleSided
          && (transform.position.z < wall.back.floor.height
           || transform.position.z > wall.back.ceiling.height)) {
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
    game.resources.load('/assets/texture/WALL40_1.png'),
    game.resources.load('/assets/texture/M1_1.png'),
    game.resources.load('/assets/texture/PLAYA1.png'),
    game.resources.load('/assets/texture/PLAYA2A8.png'),
    game.resources.load('/assets/texture/PLAYA3A7.png'),
    game.resources.load('/assets/texture/PLAYA4A6.png'),
    game.resources.load('/assets/texture/PLAYA5.png'),
    game.resources.loadSequence('/assets/weapons/HAND03.png', 3),
    game.resources.loadSequence('/assets/weapons/CHAINSAW%02d.png', 3),
    game.resources.loadSequence('/assets/weapons/PISTOL%02d.png', 5),
    game.resources.loadSequence('/assets/weapons/SHOTGUN%02d.png', 5),
    game.resources.loadSequence('/assets/weapons/SSHOTGUN%02d.png', 9),
    game.resources.loadSequence('/assets/weapons/CHAINGUN%02d.png', 3),
    game.resources.loadSequence('/assets/weapons/ROCKETL%02d.png', 5),
    game.resources.load('/assets/weapons/ROCKET_F.png'),
    game.resources.load('/assets/weapons/ROCKETFS.png'),
    game.resources.load('/assets/weapons/ROCKET_S.png'),
    game.resources.load('/assets/weapons/ROCKETRS.png'),
    game.resources.load('/assets/weapons/ROCKET_R.png'),
    game.resources.loadSequence('/assets/weapons/ROCKETEXP%02d.png', 2),
    game.resources.loadSequence('/assets/weapons/PLASMA%02d.png', 3),
    game.resources.loadSequence('/assets/weapons/BFG%02d.png', 4),
    game.resources.load('/assets/ambient/UB03-005 1.mp3'),
    game.resources.load('/assets/sfx/DSRLAUNC.wav'),
    game.resources.load('/assets/sfx/DSBAREXP.wav'),
    game.resources.load('/assets/level/test.json')
  ])

  game.level.from(game.resources.get('/assets/level/test.json'))

  const { spawns } = game.resources.get('/assets/level/test.json')
  for (const spawn of spawns) {
    game.scheduler.create(spawn.type, game, ...spawn.args)
  }

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
    sources: game.resources.getAll([
      'PLAYA1.png',
      'PLAYA2A8.png',
      'PLAYA3A7.png',
      'PLAYA4A6.png',
      'PLAYA5.png',
      'PLAYA4A6.png',
      'PLAYA3A7.png',
      'PLAYA2A8.png'
    ], '/assets/texture/')
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
      gravity: 0.1,
      friction: 0.95
    })
  )
  this.set('listener', game.registry.create(AudioListenerComponent))

  const weapon = game.scheduler.create('weapon', game)
  const healthStatus = game.scheduler.create('health-status', game)
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
      body.velocity.z = 4
    }

    document.title = `${view.renderedWalls} ${view.renderedPlanes}`
    yield // frame;
  }
}

function * HealthStatusBehaviour(game) {
  const transform = game.registry.create(TransformComponent)
  this.set('transform', transform)

  const text = game.registry.create(UITextComponent, {
    text: 'Hello, World!'
  })
  this.set('renderable', text)

  transform.position.x = 160
  transform.position.y = 120

  while (true) {
    yield
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
      sources: game.resources.sequence('/assets/weapons/HAND%02d.png', 3)
    },
    {
      // Pistola
      sources: game.resources.sequence('/assets/weapons/PISTOL%02d.png', 5)
    },
    {
      // Escopeta
      sources: game.resources.sequence('/assets/weapons/SHOTGUN%02d.png', 5)
    },
    {
      // Super escopeta
      sources: game.resources.sequence('/assets/weapons/SSHOTGUN%02d.png', 9)
    },
    {
      // Ametralladora
      sources: game.resources.sequence('/assets/weapons/CHAINGUN%02d.png', 3)
    },
    {
      // Rocket Launcher
      sources: game.resources.sequence('/assets/weapons/ROCKETL%02d.png', 5)
    },
    {
      // Cañón de plasma
      sources: game.resources.sequence('/assets/weapons/PLASMA%02d.png', 3)
    },
    {
      // BFG
      sources: game.resources.sequence('/assets/weapons/BFG%02d.png', 4)
    }
  ]

  const transform = game.registry.create(TransformComponent)
  this.set('transform', transform)

  // Cada uno de estos elementos necesita un "punto de control"
  // como en DIV para hacer que la animación salga exactamente
  // donde debe estar.
  let animationIndex = 0
  const animation = game.resources.sequence('/assets/weapons/ROCKETL%02d.png', 5)
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
game.scheduler.register('health-status', HealthStatusBehaviour)

game.scheduler.create('level', game)

game.start()
