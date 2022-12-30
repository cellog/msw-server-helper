import "@testing-library/cypress/add-commands";
import { addCommands } from "@gregcello/msw-server-helper-cypress/addCommands";

Cypress.on("uncaught:exception", (err) => {
  // Cypress and React Hydrating the document don't get along
  // for some unknown reason. Hopefully we figure out why eventually
  // so we can remove this.
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #423/.test(err.message)
  ) {
    return false;
  }
});

addCommands();

beforeEach(() => {
  // reset all existing server msw mocks between tests
  cy.resetMockOverrides();
});
