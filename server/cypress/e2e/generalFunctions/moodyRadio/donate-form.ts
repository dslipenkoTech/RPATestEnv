import { URLS } from "~cypress/environment";

const link = Cypress.env("Radio") as string;

describe("Donate form testing", { tags: ["@moody-radio", "@radio", "@premise"] }, () => {
  beforeEach(() => URLS(link));

  it("Testing the button on the home page", () => {
    cy.get(".donate").should("be.visible").should("have.text", "Donate").should("have.attr", "href").and("include", "give.moodyradio.org");

    cy.get(".donate").click();
  });

  it("Testing the form on the donate page", { tags: ["@premise-form"] }, () => {
    cy.visit(
      "https://give.moodyradio.org/fall-share-t?ps=ag30&appeal=MR&utm_medium=button&utm_source=web&utm_term=network&utm_campaign=moodyradio.org&_gl=118x281j_gaMTQzNzk5OTY0Ni4xNzU4OTE0MjQ0_ga_4WH1937046czE3NTg5MTQyNDQkbzEkZzEkdDE3NTg5MTQyNDYkajU4JGwwJGgw"
    );

    cy.origin("https://give.moodyradio.org", () => {
      cy.get("#main-graphic").should("be.visible").should("have.attr", "src").and("not.be.empty");

      cy.get("#center-panel > div.row.justify-content-center > div > div:nth-child(1)")
        .should("be.visible")
        .within(() => {
          cy.get("h5").should("be.visible").should("have.text", "Prefer to give by phone?(888) 333-4015");
        });

      cy.contains("How would you like to partner with us?").should("be.visible");
      // Test donation type buttons
      cy.get("#center-panel > div.row.justify-content-center > div > div:nth-child(2) > span:nth-child(1) > div:nth-child(2)")
        .should("be.visible")
        .within(() => {
          cy.get("button").contains("Single Gift").should("be.visible");
          cy.get("button").contains("Become a Monthly Partner").should("be.visible").should("have.class", "active");
          cy.get("button").contains("Increase Monthly Partner Gift").should("be.visible");

          // Test button switching
          cy.get("button").contains("Become a Monthly Partner").click().should("have.class", "active");
          cy.get("button").contains("Single Gift").should("not.have.class", "active");
        });

      cy.contains("Choose your gift amount").should("be.visible");
      // Test gift amount buttons
      cy.get("#center-panel > div.row.justify-content-center > div > div:nth-child(2) > span:nth-child(2) > div:nth-child(2)")
        .should("be.visible")
        .within(() => {
          // Test preset amount buttons
          cy.get("button").contains("$30").should("be.visible").should("have.class", "active");
          cy.get("button").contains("$50").should("be.visible");
          cy.get("button").contains("$100").should("be.visible");

          // Test Other button and input
          cy.get("#other-btn").should("be.visible").should("contain", "Other");
          cy.get("#other-input").should("not.be.visible"); // Input should be hidden initially

          // Test clicking preset amounts
          cy.get("button").contains("$50").click().should("have.class", "active");
          cy.get("button").contains("$30").should("not.have.class", "active");

          // Test Other button functionality
          cy.get("#other-btn").click();
          cy.get("#other-input").should("be.visible");
          cy.get("#other-input").type("150");
        });

      // Test Payment Method buttons
      cy.contains("Payment Information").should("be.visible");
      cy.get("#center-panel > div.row.justify-content-center > div > div:nth-child(3) > div:nth-child(2)")
        .should("be.visible")
        .within(() => {
          // Test Credit Card button (default active)
          cy.get("button").contains("Credit Card").should("be.visible").should("have.class", "active");

          // Test Bank Transfer button
          cy.get("button").contains("Bank Transfer").should("be.visible").should("not.have.class", "active");

          // Test switching to Bank Transfer
          cy.get("button").contains("Bank Transfer").click().should("have.class", "active");
          cy.get("button").contains("Credit Card").should("not.have.class", "active");

          // Test switching back to Credit Card
          cy.get("button").contains("Credit Card").click().should("have.class", "active");
          cy.get("button").contains("Bank Transfer").should("not.have.class", "active");
        });

      // Testing the Credit Card Form
      cy.get("#center-panel > div.row.justify-content-center > div > div:nth-child(3) > div:nth-child(4)")
        .should("be.visible")
        .within(() => {
          // Test Card Number field
          cy.get("label[for='ccNumber']").should("be.visible").should("contain", "Card Number");
          cy.get("#cardNumber").should("be.visible").should("have.class", "stripeCardInput");
          // cy.get("#card-errors").should("be.visible");

          // Test Expiration field
          cy.get("label[for='exp']").should("be.visible").should("contain", "Expiration");
          cy.get("#cardExpiry").should("be.visible").should("have.class", "stripeCardInput");

          // Test Security Code field
          cy.get("label[for='cvv']").should("be.visible").should("contain", "Security Code");
          cy.get("#cardCvc").should("be.visible").should("have.class", "stripeCardInput");

          // Test CVV help button and tooltip
          cy.get(".info-button").should("be.visible").click();
          cy.get(".popper").should("be.visible");
          cy.get(".helpInfo").should("be.visible").should("contain", "The CVV is a 3- or 4-digit security number");

          // Test that all Stripe Elements are present
          cy.get(".StripeElement").should("have.length", 3);
          cy.get("iframe[title*='Secure card number input frame']").should("be.visible");
          cy.get("iframe[title*='Secure expiration date input frame']").should("be.visible");
          cy.get("iframe[title*='Secure CVC input frame']").should("be.visible");
        });

      cy.contains("Contact Information").should("be.visible");
      cy.get("#center-panel > div.row.justify-content-center > div > div:nth-child(4)")
        .should("be.visible")
        .within(() => {
          // Test First Name field
          cy.get("label[for='firstName']").should("be.visible").should("contain", "First Name");
          cy.get("#firstName").should("be.visible").should("have.attr", "type", "text");
          cy.get("#firstName").type("John");

          // Test Last Name field
          cy.get("label[for='lastName']").should("be.visible").should("contain", "Last Name");
          cy.get("#lastName").should("be.visible").should("have.attr", "type", "text");
          cy.get("#lastName").type("Doe");

          // Test Country dropdown
          cy.get("label[for='country']").should("be.visible").should("contain", "Country");

          cy.get("#vs1__combobox").should("be.visible");

          // Test Street Address field
          cy.get("label[for='address1']").should("be.visible").should("contain", "Street Address");
          cy.get("#address1").should("be.visible").should("have.attr", "type", "text");
          cy.get("#address1").type("123 Main Street");

          // Test Zip Code field
          cy.get("label[for='zip']").should("be.visible").should("contain", "Zip Code");
          cy.get("#zip").should("be.visible").should("have.attr", "type", "text");
          cy.get("#zip").type("12345");

          // Test Phone Number field
          cy.get("label[for='phone']").should("be.visible").should("contain", "Phone Number");
          cy.get("#phone").should("be.visible").should("have.attr", "type", "text");
          cy.get("#phone").type("555-123-4567");

          // Test Email field
          cy.get("label[for='email']").should("be.visible").should("contain", "Email");
          cy.get("#email").should("be.visible").should("have.attr", "type", "text");
          cy.get("#email").type("john.doe@example.com");
        });

      cy.get(
        "#center-panel > div.row.justify-content-center > div > div.justify-content-center.section > div.row.justify-content-center > button"
      )
        .should("be.visible")
        .should("have.text", "Make My Gift");
    });
  });
});
