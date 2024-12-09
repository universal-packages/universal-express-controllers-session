import { ExpressSessionOptions } from '@universal-packages/express-session'

export const CURRENT_OPTIONS: ExpressSessionOptions = {}

export function initialize(options?: ExpressSessionOptions): void {
  if (options) {
    Object.keys(options).forEach((key) => {
      if (options[key]) CURRENT_OPTIONS[key] = options[key]
    })
  }
}
