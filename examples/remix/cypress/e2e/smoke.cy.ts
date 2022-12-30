import type { handlerOverrides } from "../../app/mocks/server/mocks";

describe("smoke tests", () => {
  it("should display an API failed to load message if the fail handler is active", () => {
    cy.enableMockOverride<typeof handlerOverrides>({
      endpoint: "http://example.com",
      method: "get",
      override: "fail",
    });
    cy.visit("/");
    cy.findByText("Error: failed to load").should("be.visible");
    cy.findByText("Totally fake response").should("not.exist");
    cy.findByText("More information...").should("not.exist");
  });

  it("should display the actual API result if no mocking is enabled", () => {
    cy.visit("/");
    cy.findByText("More information...").should("be.visible");
    cy.findByText("Error: failed to load").should("not.exist");
    cy.findByText("Totally fake response").should("not.exist");
  });

  it("should display an API success message if the success handler is active", () => {
    cy.enableMockOverride<typeof handlerOverrides>({
      endpoint: "http://example.com",
      method: "get",
      override: "success",
    });
    cy.visit("/");
    cy.findByText("Totally fake response").should("be.visible");
    cy.findByText("Error: failed to load").should("not.exist");
    cy.findByText("More information...").should("not.exist");
  });

  it("should display a dynamic API success message if the success handler is active and accepts args", () => {
    cy.enableMockOverride<typeof handlerOverrides>({
      endpoint: "http://example.com",
      method: "get",
      override: "custom",
      args: ["<html><head></head><body>Custom!</body></html>"],
    });
    cy.visit("/");
    cy.findByText("Custom!").should("be.visible");
    cy.findByText("Totally fake response").should("not.exist");
    cy.findByText("Error: failed to load").should("not.exist");
    cy.findByText("More information...").should("not.exist");
  });
});
