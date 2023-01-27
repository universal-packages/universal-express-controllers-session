import { BaseController, Controller, Get, Post } from '@universal-packages/express-controllers'
import { AuthenticateController } from '../../src'

@Controller('excellent')
@AuthenticateController()
export default class ExcellentController extends BaseController {
  @Post('private_1')
  public async getEnd(): Promise<void> {
    this.json({ id: this.request.session.authenticatableId })
  }

  @Post('private_2')
  public async postEnd(): Promise<void> {
    this.json({ id: this.request.session.authenticatableId })
  }
}
