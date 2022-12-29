import { getHandlers } from "@gregcello/msw-server-helper";
import { setupServer } from "msw/node";
import { handlerOverrides } from "./mocks";

const server = setupServer(...getHandlers(handlerOverrides));

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
