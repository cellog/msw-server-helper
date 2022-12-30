# msw-server-helper

Dynamic modification of node mock service worker mocks from within browser-based tests like Cypress and Playwright.

This allows mocking external endpoints that would otherwise be un-interceptable, and dynamically modifying their values.

This version only supports REST endpoints

## Installation

```
npm i @gregcello/msw-server-helper msw sqlite3
```

```
yarn add @gregcello/msw-server-helper msw sqlite3
```

```
pnpm add @gregcello/msw-server-helper msw sqlite3
```

## Usage

This is a low-level package intended to be used inside one of the higher-level helpers like `@gregcello/msw-server-helper-cypress`.

This package is designed to be integrated with `msw` (https://mswjs.io/). Follow the instructions to set up Node-based mocks, and then
initialize your mocks. Here is an example:

```ts
// inside server-mocks.js
import { getHandlers } from "@gregcello/msw-server-helper";
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

By default, none of the mocks are enabled, and the request will pass through to the original URL.

To intercept an endpoint, `enableMockOverride` should be called. Here are 3 examples:

```ts
import { enableMockOverride } from "@gregcello/msw-server-helper";

import { handlerOverrides } from "./mocks/server"

// this can be called in a Cypress task, for instance
enableMockOverride({
  declarations: handlerOverrides,
  endpoint: "https://api.github.com/user/:login",
  method: "get",
  override: "success"
});
```

Full type safety is available - `enableMockOverride` will have type errors if endpoint, method, or override does not exist in the handler overrides.

### resetting all server mocks

To reset all server mocks to the pass-through state, use `resetMockOverrides`

```ts
import { resetMockOverrides } from "@gregcello/msw-server-helper";

resetMockOverrides();
```