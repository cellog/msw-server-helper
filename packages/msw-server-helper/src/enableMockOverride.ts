import { MswServerHelperError } from './MswServerHelperError'
import { PrismaClient } from './prisma/msw-server-helper/client'
import type { EnableMockOverrideProps, EndpointMockShape } from './types'

export async function enableMockOverride<
  EndpointMocks extends EndpointMockShape,
  Endpoint extends keyof EndpointMocks = keyof EndpointMocks,
  Override extends keyof EndpointMocks[Endpoint] = keyof EndpointMocks[Endpoint]
>({
  endpoint,
  override,
  args,
}: EnableMockOverrideProps<EndpointMocks, Endpoint, Override>) {
  const client = new PrismaClient()

  try {
    await client.endpoint.upsert({
      update: {
        endpointMatcher: endpoint as string,
        handlerName: override as string,
        ...(args === undefined
          ? {}
          : {
              arguments: JSON.stringify(args),
            }),
      },
      create: {
        endpointMatcher: endpoint as string,
        handlerName: override as string,
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
