import { MswServerHelperError } from './MswServerHelperError'
import { PrismaClient } from './prisma/msw-server-helper/client'
import type {
  EnableMockOverrideProps,
  EndpointMockShape,
  Methods,
} from './types'

export async function enableMockOverride<
  EndpointMocks extends EndpointMockShape,
  Endpoint extends keyof EndpointMocks = keyof EndpointMocks,
  Method extends keyof EndpointMocks[Endpoint] = keyof EndpointMocks[Endpoint],
  Override extends keyof EndpointMocks[Endpoint][Method] = keyof EndpointMocks[Endpoint][Method]
>({
  endpoint,
  override,
  method,
  args,
}: EnableMockOverrideProps<EndpointMocks, Endpoint, Method, Override>) {
  const client = new PrismaClient()

  try {
    await client.endpoint.upsert({
      update: {
        endpointMatcher: endpoint as string,
        handlerName: override as string,
        method: method as Methods,
        ...(args === undefined
          ? {}
          : {
              arguments: JSON.stringify(args),
            }),
      },
      create: {
        endpointMatcher: endpoint as string,
        handlerName: override as string,
        method: method as Methods,
        ...(args === undefined
          ? {}
          : {
              arguments: JSON.stringify(args),
            }),
      },
      where: {
        endpointMatcher: endpoint as string,
      },
    })
  } catch (e) {
    throw new MswServerHelperError(
      `Unable to register mock override "${override as string}" for "${
        endpoint as string
      }"`,
      e as Error
    )
  }
}
