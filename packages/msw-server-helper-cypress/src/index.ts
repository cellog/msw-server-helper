/// <reference types="cypress" />

import type {
  EnableMockOverrideProps,
  EndpointMockShape,
} from '@gregcello/msw-server-helper'

export * from './addTask'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example
       * import type { handlerOverrides } from "path/to/msw/mocks/server";
       *
       * cy.enableMockOverride<typeof handlerOverrides>({
       *   endpoint: "https://api.github.com/user/:login",
       *   method: "get",
       *   override: "fail",
       * });
       * @example
       * import type { handlerOverrides } from "path/to/msw/mocks/server";
       *
       * cy.enableMockOverride<typeof handlerOverrides>({
       *   endpoint: "https://api.github.com/user/:login",
       *   method: "get",
       *   override: "specifyUser",
       *   args: ["customUser"],
       * });
       */
      enableMockOverride<
        EndpointMocks extends EndpointMockShape,
        Endpoint extends keyof EndpointMocks = keyof EndpointMocks,
        Method extends keyof EndpointMocks[Endpoint] = keyof EndpointMocks[Endpoint],
        Override extends keyof EndpointMocks[Endpoint][Method] = keyof EndpointMocks[Endpoint][Method]
      >(
        props: Omit<
          EnableMockOverrideProps<EndpointMocks, Endpoint, Method, Override>,
          'declarations'
        >
      ): Chainable<Element>
      resetMockOverrides(): void
    }
  }
}
