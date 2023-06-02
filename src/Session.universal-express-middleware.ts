import { BaseMiddleware, Middleware } from '@universal-packages/express-controllers'
import { injectSession } from '@universal-packages/express-session'

import { CURRENT_OPTIONS } from './express-controllers-session'

@Middleware()
export default class SessionMiddleware extends BaseMiddleware {
  public async middleware(): Promise<void> {
    await injectSession(this.request, this.response, CURRENT_OPTIONS)
  }
}
