import { ExpressSessionOptions } from '@universal-packages/express-session'

export const CURRENT_OPTIONS: ExpressSessionOptions = {}

export function initialize(options?: ExpressSessionOptions): void {
  if (options && options.cookieName) CURRENT_OPTIONS.cookieName = options.cookieName
  if (options && options.engine) CURRENT_OPTIONS.engine = options.engine
  if (options && options.registryId) CURRENT_OPTIONS.registryId = options.registryId
  if (options && options.trackSessionAccess) CURRENT_OPTIONS.trackSessionAccess = options.trackSessionAccess
}
