# msw-server-helper-cypress

Dynamic modification of node mock service worker mocks from within Cypress tests.

This package uses an sqlite database to control which of a list of alternative mock handlers should be used.
An example using remix based on the Indie stack is at https://github.com/cellog/msw-server-helper/tree/main/examples/remix

## Installation

```
npm i @gregcello/msw-server-helper-cypress @gregcello/msw-server-helper msw
```

```
yarn add @gregcello/msw-server-helper-cypress @gregcello/msw-server-helper msw
```

```
pnpm add @gregcello/msw-server-helper-cypress @gregcello/msw-server-helper msw
```

## Usage

To enable `msw-server-helper-cypress`, first mock service worker must be set up for your app. To gain full
advantage of Typescript typing, we recommend using typescript for your mocks rather than `mocks.js`.

```ts
// inside server-mocks.js
import { getHandlers, declareHandlers } from "@gregcello/msw-server-helper";
import { rest } from "msw"

export const handlerOverrides = declareHandlers({
  "https://api.github.com/user/:login": {
    get: {
      success: (req, res, ctx) => {
        return res(ctx.json({ login: req.params.login }));
      },
      fail: (req, res, ctx) => {
        return res(ctx.status(500));
      },
      specifyUser: (req, res, ctx, args) => {
        const [user] = args || ["defaultUser"]
        return res(ctx.json({ login: user }));
      },
    },
  },
});

export const handlers = [
  // static handlers go here
  rest.get("/simple-endpoint", ...),
  ...getHandlers(handlerOverrides),
];
```

Cypress can then be set up in 3 areas:

# `cypress.config.ts` to add the `enableMockOverride` and `resetMockOverride` tasks
# `cypress/support/e2e.ts` to add custom commands `cy.enableMockOverride` and `cy.resetMockOverrides`
# a `beforeEach` that calls `cy.resetMockOverrides`


in `cypress.config.ts`:

```ts
import {
  enableMockOverride,
  resetMockOverrides,
} from "@gregcello/msw-server-helper-cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // other Cypress setup goes here
      on('task', {
        // any existing tasks go here 
        enableMockOverride,
        resetMockOverrides,
      });
    },
  },
});
```

in `cypress/support/e2e.ts`:

```ts
import { addCommands } from "@gregcello/msw-server-helper-cypress/addCommands";

addCommands();

beforeEach(() => {
  // reset all existing server msw mocks between tests
  cy.resetMockOverrides();
});
```

## Usage in tests

```ts
import type { handlerOverrides } from "path/to/msw/mocks/server";

describe("...", () => {
  it("...", () => {
    cy.enableMockOverrides<typeof handlerOverrides>({
      endpoint: "https://api.github.com/user/:login",
      method: "get",
      override: "fail",
    });

    // perform an action that will hit the github API
  });

  it("...", () => {
    cy.enableMockOverrides<typeof handlerOverrides>({
      endpoint: "https://api.github.com/user/:login",
      method: "get",
      override: "specifyUser",
      args: ["joeshmoe"],
    });

    // perform an action that will hit the github API and expects "joeshmoe" to be the logged in user
  });
});
```

## Usage in remix

For starters like the Indie Stack (https://github.com/remix-run/indie-stack) a few changes need to be made to take full advantage in addition to the Cypress config.

### Typescript
- modify msw mocks to be typescript or use `HandlerShape` in tests
- is msw mocks are typescript modify package.json to remove `binode -r ./mocks`
- if msw mocks are typescript, modify `entry.server.tsx` to load the mocks
- reorganize the mocks to make it crystal clear these only get enabled in the server

If you wish to have maximum type safety in tests, 3 steps are needed to enable type-safe mocks.

`package.json`:

change the `dev:remix` and `start:mocks` steps to:

```json
    "dev:remix": "cross-env NODE_ENV=development binode -- @remix-run/dev:remix dev",
    "start:mocks": "cross-env MSW_MOCKS=1 binode -- @remix-run/serve:remix-serve build",
```

`entry.server.tsx`:

add these lines to conditionally load msw's mocks when :

```ts
if (process.env.NODE_ENV === "development" || process.env.MSW_MOCKS) {
  // enable mock service worker server-side intercepts
  require("./mocks/server");
}
```

rename `app/mocks/index.js` to `app/mocks/server/index.ts` and add `app/mocks/server/mocks.ts`

Change `app/mocks/server/index.ts` to the following:

```ts
import { getHandlers } from "@gregcello/msw-server-helper";
import { setupServer } from "msw/node";
import { handlerOverrides } from "./mocks";

const server = setupServer(...getHandlers(handlerOverrides));

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
```

### Javascript
- if Cypress tests are in typescript, use `HandlerShape` to get type safety on server mocks
- add the `@gregcello/msw-server-helper` code

`app/mocks/index.js`:

```js
import { getHandlers } from "@gregcello/msw-server-helper";
import { setupServer } from "msw/node";

const server = setupServer(...getHandlers({
  // example mocks, replace with your own
  "http://example.com": {
    get: {
      success: (req, res, ctx) => {
        return res(
          ctx.text(
            "<html><head></head><body>Totally fake response</body></html>"
          )
        );
      },
      fail: (req, res, ctx) => {
        return res(ctx.status(500));
      },
      custom: (req, res, ctx, args) => {
        const [responseBody] = (args as [string] | undefined) || [
          "<html><head></head><body>Totally fake response</body></html>",
        ];
        return res(ctx.text(responseBody));
      },
    },
  },
}));

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
```

In Cypress tests that are typescript, use the `HandlerShape` type to get type safety:

```ts
import type { HandlerShape } from "@gregcello/msw-server-helper";

type Mocks = HandlerShape<{
  "http://example.com": {
    get: ["success", "fail", "custom"]
  }
}>
```

This has serious risks: you are declaring types, but if the mocks change, and you don't update the `Mocks` type in the test, it will give
type safety assurances without actually being type-safe. Hopefully, the test will also fail, but this is not a guarantee, whereas using typescript
for mocks does guarantee instant feedback if a test is relying upon a stale mock. When `msw-server-helper` is unable to find a mock, it will
ignore a request to override it, and the test will instead hit the live endpoint. Should that endpoint return the same value that was mocked, no
indication of failure will occur until the test is running in CI and is suddenly flaky because it's not actually mocking the endpoint.
Use this solution at your own risk!