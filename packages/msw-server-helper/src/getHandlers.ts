import { Ctx, EndpointMockShape, Handler, Methods, Req, Res } from './types'
import { PrismaClient } from './prisma/msw-server-helper/client'
import { rest } from 'msw'

const client = new PrismaClient()

export function getHandlers(mocks: EndpointMockShape) {
  return Object.entries(mocks).map(([endpoint, overrides]) => {
    return Object.entries(overrides).map(([method, handlers]) => {
      const interceptor = async (req: Req, res: Res, ctx: Ctx) => {
        const result = await client.endpoint.findFirst({
          where: {
            endpointMatcher: endpoint,
            method: method,
          },
        })
        if (!result) {
          return req.passthrough()
        }
        const handler = handlers[result.handlerName]
        if (!handler) {
          return req.passthrough()
        }
        return handler(
          req,
          res,
          ctx,
          result.arguments === null ? undefined : JSON.parse(result.arguments)
        )
      }
      return rest[method as Methods](endpoint, interceptor as any)
    })
  })
}
