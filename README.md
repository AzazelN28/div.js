# DIV.js

Un pequeño proyecto para hacer juegos con JavaScript al estilo de [DIV Games Studio](https://es.wikipedia.org/wiki/DIV_Games_Studio).

La forma de "emular" los procesos es a través de funciones generadoras y `yield`.

Ejemplo:

```javascript
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

const projectile = game.core.define(ProjectileBehaviour)
```

La API, salvo por el concepto de "procesos", no se parece en nada a la de DIV. La idea era probar el concepto de los procesos, más que hacer una API equivalente o compatible.

Creo que usando este método y quizá con un _transpiler_ que pase de lenguaje DIV a JavaScript sería bastante fácil implementar una API 100% compatible con DIV.

## Agradecimientos

A [zardoz89](https://github.com/Zardoz89/), [vii1](https://github.com/vii1/), [panreyes](https://github.com/panreyes/) y a toda la gente del canal [diveros](https://diveros.slack.com) de Slack.

Made with :heart: by [AzazelN28](https://github.com/AzazelN28)
