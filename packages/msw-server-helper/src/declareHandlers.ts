import { EndpointMockShape } from './types'

export function declareHandlers<Endpoints extends EndpointMockShape>(
  mocks: Endpoints
) {
  return mocks
}
