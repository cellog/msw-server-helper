import { rest } from 'msw'
export interface EndpointMockShape {
  [Endpoints: string]: {
    [Handler: string]: Parameters<typeof rest.get>[1]
  }
}

export interface EnableMockOverrideProps<
  EndpointMocks extends EndpointMockShape,
  Endpoint extends keyof EndpointMocks = keyof EndpointMocks,
  Override extends keyof EndpointMocks[Endpoint] = keyof EndpointMocks[Endpoint]
> {
  endpoint: Endpoint
  override: Override
  args?: Array<any>
}
