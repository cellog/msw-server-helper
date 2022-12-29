# msw-server-helper-cypress

Dynamic modification of node mock service worker mocks from within Cypress tests.

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

Cypress setup should be as follows:

in `cypress.config.ts`:

```ts
import { enableMockOverride } from "@gregcello/msw-server-helper-cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', enableMockOverride);
    },
  },
});
```

in `cypress/support/e2e.ts`:

```ts
import { addCommands } from "@gregcello/msw-server-helper-cypress";

addCommands();
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
});
```