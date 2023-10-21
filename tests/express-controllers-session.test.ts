import { MemoryEngine } from '@universal-packages/token-registry'

import { initialize } from '../src'

describe('express-controllers-session', (): void => {
  it('It executed configured middleware all across controllers', async (): Promise<void> => {
    initialize({ cookieName: 'session', engine: new MemoryEngine(), registryId: 'app', trackSessionAccess: false })

    await runExpressApp()

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
