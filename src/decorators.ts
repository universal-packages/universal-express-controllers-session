import { ActionUse, ControllerUse } from '@universal-packages/express-controllers'
import { authenticateRequest } from '@universal-packages/express-session'
import { ClassDecoratorFunction, MethodDecoratorFunction } from '@universal-packages/namespaced-decorators'

export function AuthenticateAction(): MethodDecoratorFunction {
  return ActionUse(authenticateRequest)
}

export function AuthenticateController(): ClassDecoratorFunction {
  return ControllerUse(authenticateRequest)
}
