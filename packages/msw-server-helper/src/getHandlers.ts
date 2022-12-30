import { rest } from 'msw'
import type { Ctx, EndpointMockShape, Methods, Req, Res } from './types'
import { SqliteClient } from './SqliteClient'

const client = new SqliteClient()

export function getHandlers(mocks: EndpointMockShape) {
  return Object.entries(mocks).flatMap(([endpoint, overrides]) => {
    return Object.entries(overrides).map(([method, handlers]) => {
      const interceptor = async (req: Req, res: Res, ctx: Ctx) => {
        const result = await client.getMatcher({
          endpointMatcher: endpoint,
          method: method as Methods,
        })
        if (!result) {
          return req.passthrough()
        }
        const handler = handlers[result.handlerName]
        if (!handler) {
          return req.passthrough()
        }
        return handler(req, res, ctx, result.arguments as any)
      }
      return rest[method as Methods](endpoint, interceptor as any)
    })
  })
}
