import { declareHandlers } from "@gregcello/msw-server-helper";

export const handlerOverrides = declareHandlers({
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
});
