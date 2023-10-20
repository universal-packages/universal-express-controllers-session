import { ExpressApp } from '@universal-packages/express-controllers'
import { MemoryEngine } from '@universal-packages/token-registry'

import { initialize } from '../src'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

let app: ExpressApp
afterEach(async (): Promise<void> => {
  await app.stop()
})

describe('express-controllers-session', (): void => {
  it('It executed configured middleware all across controllers', async (): Promise<void> => {
    initialize({ cookieName: 'session', engine: new MemoryEngine(), registryId: 'app', trackSessionAccess: false })

    app = new ExpressApp({ appLocation: './tests/__fixtures__', port })
    app.on('request/error', console.log)
    await app.prepare()
    await app.run()

    // Authenticated action plus login
    await fGet('/good/login')
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ token: expect.any(String) })

    const loginToken = fResponseBody.token

    await fPost('/good/private', {})
    expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')

    fAuthorization(`bearer ${loginToken}`)
    await fPost('/good/private', {})
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ id: '10' })

    // Authenticated controller
    fAuthorization(undefined)
    await fPost('/excellent/private_1', {})
    expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')

    await fPost('/excellent/private_2', {})
    expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')

    fAuthorization(`bearer ${loginToken}`)
    await fPost('/excellent/private_1', {})
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ id: '10' })

    await fPost('/excellent/private_2', {})
    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ id: '10' })
  })
})
