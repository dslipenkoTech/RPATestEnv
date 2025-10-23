import { URLS } from "~cypress/environment";
import { header, footer } from "~cypress/components/headerFooterComponents/moody-radio";

const link = Cypress.env("Radio") as string;

describe("Moody Radio", { tags: ["@moody-radio", "@radio", "@home-page", "@premise"] }, () => {
  beforeEach(() => {
    URLS(link);
  });

  header();

  // Finished
  it("Main banner should display all images and have valid urls", () => {
    cy.get("h1").should("be.visible").and("not.be.empty");
    cy.get("h2").should("be.visible").and("not.be.empty");

    cy.get("body > div.Body.Themeable > div > div:nth-child(1) > div.widgetMain > div > div.head > ul").should("be.visible");
    cy.get("body > div.Body.Themeable > div > div:nth-child(1) > div.widgetMain > div > div.WidgetRotatingBanner-menu > div > ul").within(
      () => {
        cy.get("li").each(($li) => {
          cy.wrap($li).find("a").should("be.visible").click();
        });
      }
    );

    cy.get("body > div.Body.Themeable > div > div:nth-child(1) > div.widgetMain > div > div.head > ul").within(() => {
      cy.get("li").each(($li) => {
        cy.wrap($li).find("a").should("have.attr", "href").and("not.be.empty");
      });
    });
  });

  if (Cypress.env("ENV_TYPE") === "production") {
    // The content is missing some of the block elements on INT and PRE
    it("Testing underwriting-content-block", () => {
      // Underwriting Content Block
      cy.get("body > div.Body.Themeable > div > div:nth-child(1) > section > div").within(() => {
        cy.get("h2").should("be.visible").and("not.be.empty");

        cy.get("div > a").should("be.visible").and("have.attr", "href").and("not.be.empty");
      });

      // Programs
      cy.get("body > div.Body.Themeable > div > div:nth-child(1) > div.desktopTable")
        .should("be.visible")
        .within(() => {
          cy.get("div.row").each(($row) => {
            cy.wrap($row).find(".col-sm-4 img").should("be.visible");
            cy.wrap($row).find(".col-sm-4 .Button.primary-button").should("be.visible");
          });
        });
    });
  }

  if (Cypress.env("ENV_TYPE") === "production") {
    // Only run on production because INT and PRE don't have the stories block
    // Stories Block
    it("Stories-block", () => {
      cy.get("body > div.Body.Themeable > div > div:nth-child(3) > div:nth-child(2)").within(() => {
        cy.get("h2").should("be.visible").and("not.be.empty");
        cy.get("p").should("be.visible").and("not.be.empty");

        cy.get("div.row").each(($row) => {
          cy.wrap($row).find(".col-md-4 > p > a").should("be.visible").and("have.attr", "href").and("not.be.empty");
        });

        cy.get("p > a").should("be.visible").and("have.attr", "href").and("not.be.empty");
      });
    });

    it("News-block", () => {
      cy.get("body > div.Body.Themeable > div > div:nth-child(3) > div:nth-child(4)").within(() => {
        cy.get("h2").should("be.visible").and("not.be.empty");
        cy.get("p").should("be.visible").and("not.be.empty");

        cy.get("div.row").each(($row) => {
          cy.wrap($row).find(".col-md-4 > p > a").should("be.visible").and("have.attr", "href").and("not.be.empty");
        });

        cy.get("p > a").should("be.visible").and("have.attr", "href").and("not.be.empty");
      });
    });
  }

  if (Cypress.env("ENV_TYPE") === "production") {
    // Only run on production because INT and PRE are testing the form
    it("Form on the home page", { tags: ["@premise-form"] }, () => {
      const form = cy.get("#__field_").within(() => {
        form.find("img[alt]").should("be.visible");

        cy.get("h2").should("be.visible");

        // all text inputs are visible and typable
        cy.get('input[type="text"]').each(($input) => {
          const label = $input.prev("label").text().toLowerCase().trim();

          if (["*first name", "*last name", "*email address"].includes(label)) {
            cy.wrap($input).should("be.visible").type("xyz").should("have.value", "xyz");
          } else {
            cy.wrap($input).should("not.be.visible");
          }
        });

        // select box has options and can select one non-disabled entry
        cy.get("div.Form__Element.FormSelection.ValidationRequired")
          .should("be.visible")
          .within(() => {
            cy.get("option").its("length").should("be.gt", 1);
            cy.get("option:not([disabled])")
              .eq(1)
              .then(($opt) => {
                const val = $opt.val();
                cy.get("select")
                  .select(val as string)
                  .should("have.value", val);
              });
          });
        cy.get("div.Form__Element.FormChoice.ValidationRequired > fieldset > label > input").check().should("be.checked");
        cy.get("div.Form__Element.FormChoice.ValidationRequired > fieldset > label > input").uncheck().should("not.be.checked");

        // recaptcha iframe is present
        cy.get("div.Form__Element.Form__CustomElement.FormRecaptcha > div > div > div > iframe").should("exist");

        // submit button is visible and enabled
        cy.get('button[type="submit"]').should("be.visible").and("not.be.disabled");
      });
    });
  }

  footer();
});
