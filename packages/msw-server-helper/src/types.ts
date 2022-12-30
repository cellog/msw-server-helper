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

/**
 * A convenience type for when you want to use TS without using TS in msw
 * @example
 *
 * type Mocks = HandlerShape<{
 *   "https://api.github.com/user/:login": {
 *     get: ["success", "fail", "specifyUser"],
 *   },
 * }>
 *
 * // ...
 *
 * describe("...", () => {
 *   it("...", () => {
 *     cy.enableMockOverride<Mocks>({
 *       endpoint: "https://api.github.com/user/:login",
 *       method: "get",
 *       override: "success"
 *     });
 *   });
 * });
 */
export type HandlerShape<
  EndpointMocks extends {
    [endpointMatcher: string]: {
      [method in Methods]?: string[]
    }
  }
> = {
  [EndpointMatcher in keyof EndpointMocks]: {
    [Method in keyof EndpointMocks[EndpointMatcher]]: {
      [Override in EndpointMocks[EndpointMatcher][Method] extends string[]
        ? EndpointMocks[EndpointMatcher][Method][number]
        : '']: Handler
    }
  }
}
