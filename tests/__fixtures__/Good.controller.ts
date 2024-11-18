import { BaseController, Controller, Get, Post } from '@universal-packages/express-controllers'

import { AuthenticateAction } from '../../src'

@Controller('good')
export default class GoodController extends BaseController {
  @Get('login')
  public async getEnd(): Promise<void> {
    await this.request.session.logIn('10')

    this.json({ token: this.request.session.token })
  }

  @Post('private')
  @AuthenticateAction()
  public async postEnd(): Promise<void> {
    this.json({ id: this.request.session.userId })
  }
}
