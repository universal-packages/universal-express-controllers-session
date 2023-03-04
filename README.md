# Express controllers session

[![npm version](https://badge.fury.io/js/@universal-packages%2Fexpress-controllers-session.svg)](https://www.npmjs.com/package/@universal-packages/express-controllers-session)
[![Testing](https://github.com/universal-packages/universal-express-controllers-session/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-express-controllers-session/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-express-controllers-session/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-express-controllers-session)

Express session for universal controllers.

## Install

```shell
npm install @universal-packages/express-controllers-session

npm install express
npm install @universal-packages/express-controllers
```

## Global middleware

By installing this package a global middleware is going to be loaded automatically by the `ExpressApp`.

## Global methods
#### **`initialize([options: ExpressSessionOptions])`**

Set up the global middleware session options before loading the `ExpressApp`.

```js
import { initialize } from '@universal-packages/express-controllers-session'
import { RedisEngine } from '@universal-packages/universal-token-registry-redis'

initialize({ engine: 'redis', engineOptions: { host: 'localhost' }  })

await expressApp.prepare()
```

#### Options

Same options as [express-session](https://github.com/universal-packages/universal-express-session#options).

## Decorators
#### **`@AuthenticateAction()`**

You can use @AuthenticateAction to quickly end request when no session is present at action level.

```js
import { BaseController, Controller, Get, Post } from '@universal-packages/express-controllers'
import { AuthenticateAction } from '@universal-packages/express-controllers-session'

@Controller('good')
export default class GoodController extends BaseController {
  @Get()
  @AuthenticateAction()
  async action() {
    this.request.parameters
  }
}
```

#### **`@AuthenticateController()`**

You can use @AuthenticateController to quickly end request when no session is present for every action in a controller.

```js
import { BaseController, Controller, Get, Post } from '@universal-packages/express-controllers'
import { AuthenticateController } from '@universal-packages/express-controllers-session'

@Controller('good')
@AuthenticateController()
export default class GoodController extends BaseController {
  @Get()
  async action() {
    this.request.parameters
  }
}
```

### Create your own

Creating your own decorator enables you to not only end the request but also make the request richer with additional data.

```js
import { ActionUse, ControllerUse } from '@universal-packages/express-controllers'

async function authenticateRequest(request, response, next) {
  if (request.session.authenticated) {
    request.currentUser = await User.findById(request.session.authenticatableId)

    next()
  } else {
    response.status(401).end()
  }
}

export function AuthenticateAction() {
  return ActionUse(authenticateRequest)
}

export function AuthenticateController() {
  return ControllerUse(authenticateRequest)
}
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
