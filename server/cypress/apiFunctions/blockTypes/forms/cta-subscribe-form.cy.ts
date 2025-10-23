export function ctaSubscribeForm(content: any) {
  cy.log("[CtaSubscribeForm]()");
  const formPath = `#formContainer_${content.form.contentLink} > form`;

  // Helper function to check visibility and text
  function checkVisibilityAndText(selector: string, text: string) {
    cy.get(selector).should("be.visible").and("contain.text", text);
  }

  // Header and Description
  const form = {
    header: `${formPath} > h2`,
    description: `${formPath} > aside`,
  };
  checkVisibilityAndText(form.header, "Expected Header Text"); // Example: Add expected text
  checkVisibilityAndText(form.description, "Expected Description");

  // Inputs
  const formInputs = {
    firstName: {
      name: "First Name",
      selector: `input[placeholder="First Name"]`,
    },
    lastName: {
      name: "Last Name",
      selector: `input[placeholder="Last Name"]`,
    },
    email: {
      name: "Email",
      selector: `input[placeholder="email@email.com"]`,
    },
  };

  Object.values(formInputs).forEach((input) => {
    cy.get(`${formPath} > div > section > div > ${input.selector}`)
      .parent()
      .within(() => {
        checkVisibilityAndText("label", input.name);
        cy.get(input.selector).should("be.visible").should("have.value", "").type("Testing").should("have.value", "Testing");
      });
  });

  // Buttons
  cy.get(`${formPath} > div > section > button`).should("exist").and("be.visible").invoke("text").should("not.be.empty");
  cy.get(`${formPath} > div > section > input[type="reset"]`).should("exist").and("be.visible").click();

  // Input must be empty after reset
  cy.get(`${formPath} > div > section input[type="text"]`).each(($input) => {
    cy.wrap($input).should("have.value", "");
  });
}
