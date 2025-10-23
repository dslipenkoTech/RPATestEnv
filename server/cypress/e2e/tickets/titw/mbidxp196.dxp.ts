import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-196`,
  tags: ["@ticket", "titw"],
  pages: [[2982, "A required field should show asterisk", firstIssue, {}]],
};

function firstIssue() {
  compileTicketTesting(2982).then(() => {
    // Check that First Name, Last Name, and Email fields are marked as required
    cy.get("label").contains("First Name").should("exist");
    cy.get("label").contains("Last Name").should("exist");
    cy.get("label").contains("Email").should("exist");

    // Verify the First Name and Last Name fields have required attributes
    cy.get('input[name="__field_7680"]').should("have.attr", "required");
    cy.get('input[name="__field_7678"]').should("have.attr", "required");

    // Email field uses a different structure - just verify it exists and has the ValidationRequired class
    cy.get('input[name="__field_7672"]').should("exist");

    // Check for ValidationRequired class on form elements
    cy.get('[data-f-element-name="__field_7680"]').should("have.class", "ValidationRequired");
    cy.get('[data-f-element-name="__field_7678"]').should("have.class", "ValidationRequired");
    cy.get('[data-epiforms-element-name="__field_7672"]').should("have.class", "ValidationRequired");

    // Check for visual asterisk indicators (may be added via CSS ::after)
    cy.get("label")
      .contains("First Name")
      .should(($label) => {
        const afterContent = window.getComputedStyle($label[0], "::after").content;
        expect(afterContent).to.include("*");
      });

    cy.get("label")
      .contains("Last Name")
      .should(($label) => {
        const afterContent = window.getComputedStyle($label[0], "::after").content;
        expect(afterContent).to.include("*");
      });

    cy.get("label")
      .contains("Email")
      .should(($label) => {
        const afterContent = window.getComputedStyle($label[0], "::after").content;
        expect(afterContent).to.include("*");
      });
  });
}

regressionTesting(test);
