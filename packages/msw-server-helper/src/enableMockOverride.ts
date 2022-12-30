import { MswServerHelperError } from './MswServerHelperError'
import { SqliteClient } from './SqliteClient'
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
  const client = new SqliteClient()

  try {
    await client.setRestOverride({
      endpointMatcher: endpoint as string,
      handlerName: override as string,
      method: method as Methods,
      args: args === undefined ? undefined : args,
    })
    return true
  } catch (e) {
    throw new MswServerHelperError(
      `Unable to register mock override "${override as string}" for "${
        endpoint as string
      }": ${(e as Error).message}`,
      e as Error
    )
  }
}
