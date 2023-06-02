import { ExpressApp } from '@universal-packages/express-controllers'
import { MemoryEngine } from '@universal-packages/token-registry'
import fetch from 'node-fetch'

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
    let response = await fetch(`http://localhost:${port}/good/login`)
    expect(response.status).toBe(200)
    const body = await response.json()

    response = await fetch(`http://localhost:${port}/good/private`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    })
    expect(response.status).toBe(401)

    response = await fetch(`http://localhost:${port}/good/private`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `bearer ${body.token}` }
    })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ id: '10' })

    // AUthenticated controller
    response = await fetch(`http://localhost:${port}/excellent/private_1`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    })
    expect(response.status).toBe(401)

    response = await fetch(`http://localhost:${port}/excellent/private_2`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    })
    expect(response.status).toBe(401)

    response = await fetch(`http://localhost:${port}/excellent/private_1`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `bearer ${body.token}` }
    })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ id: '10' })

    response = await fetch(`http://localhost:${port}/excellent/private_2`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `bearer ${body.token}` }
    })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ id: '10' })
  })
})
