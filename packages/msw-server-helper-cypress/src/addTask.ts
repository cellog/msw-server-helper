import type {
  EnableMockOverrideProps,
  EndpointMockShape,
} from '@gregcello/msw-server-helper'

export const enableMockOverride = async <
  EndpointMocks extends EndpointMockShape,
  Endpoint extends keyof EndpointMocks = keyof EndpointMocks,
  Method extends keyof EndpointMocks[Endpoint] = keyof EndpointMocks[Endpoint],
  Override extends keyof EndpointMocks[Endpoint][Method] = keyof EndpointMocks[Endpoint][Method]
>(
  props: EnableMockOverrideProps<EndpointMocks, Endpoint, Method, Override>
) => {
  const { enableMockOverride } = require('@gregcello/msw-server-helper')

  return enableMockOverride(props)
}

export const resetMockOverrides = async () => {
  const { resetMockOverrides } = require('@gregcello/msw-server-helper')

  return resetMockOverrides()
}
