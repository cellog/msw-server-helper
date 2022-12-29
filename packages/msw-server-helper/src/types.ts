import { rest } from 'msw'

export type Methods =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'all'

export type Req = Parameters<Parameters<typeof rest.get>[1]>[0]
export type Res = Parameters<Parameters<typeof rest.get>[1]>[1]
export type Ctx = Parameters<Parameters<typeof rest.get>[1]>[2]
export type Handler = <Args extends unknown[]>(
  req: Req,
  res: Res,
  ctx: Ctx,
  args?: Args
) => ReturnType<Parameters<typeof rest.get>[1]>

export interface EndpointMockShape {
  [Endpoints: string]: {
    [Method in Methods]?: {
      [Handler: string]: Handler
    }
  }
}

export interface EnableMockOverrideProps<
  EndpointMocks extends EndpointMockShape,
  Endpoint extends keyof EndpointMocks = keyof EndpointMocks,
  Method extends keyof EndpointMocks[Endpoint] = keyof EndpointMocks[Endpoint],
  Override extends keyof EndpointMocks[Endpoint][Method] = keyof EndpointMocks[Endpoint][Method]
> {
  declarations: EndpointMocks
  endpoint: Endpoint
  override: Override
  method: Method
  args?: Array<any>
}

export interface RestMatcher<Args = unknown> {
  endpointMatcher: string
  method: Methods
  handlerName: string
  arguments: Args | undefined
}

export interface SqliteMatcher {
  endpointMatcher: string
  method: Methods
  handlerName: string
  arguments: string
}
