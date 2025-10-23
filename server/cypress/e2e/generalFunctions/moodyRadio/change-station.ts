import { URLS } from "~cypress/environment";

const link = Cypress.env("Radio") as string;

describe("Testing change station components", { tags: ["@moody-radio", "@radio", "@premise"] }, () => {
  beforeEach(() => URLS(link));

  //   it("Testing changing the station by zip code", () => {
  //     cy.get(".changeStation")
  //       .should("be.visible")
  //       .within(() => {
  //         cy.get("a").should("be.visible").and("have.attr", "href").and("not.be.empty");
  //       })
  //       .click()
  //       .then(() => {
  //         cy.get("body > div.Modal.FindStationModal.isOpen > div > div")
  //           .should("be.visible")
  //           .within(() => {
  //             cy.get(".ModalSearch > h2").should("be.visible").should("have.text", "Find A Station");
  //           });
  //       });
  //   });

  it("Testing station search by zip code 60640", () => {
    cy.get(".changeStation")
      .should("be.visible")
      .click()
      .then(() => {
        cy.get("body > div.Modal.FindStationModal.isOpen > div > div")
          .should("be.visible")
          .within(() => {
            // Verify the modal is open and has the correct title
            cy.get(".ModalSearch > h2").should("be.visible").should("have.text", "Find A Station");

            // Test zip code input
            cy.get("#FindStationByZipTextBox").should("be.visible").clear().type("60640").should("have.value", "60640");

            // Click the Go button for zip code search
            cy.get("#FindByZip").should("be.visible").click();

            // Verify the station results are displayed
            cy.get(".FindStation").within(() => {
              cy.get("h2").should("be.visible").should("have.text", "STATIONS NEAR YOU");

              // Check that stations are displayed
              cy.get(".station").should("have.length.at.least", 1);

              // Verify station structure and content
              cy.get(".station")
                .first()
                .within(() => {
                  cy.get(".name").should("be.visible");
                  cy.get(".frequency").should("be.visible");
                  cy.get(".location").should("be.visible");
                  cy.get(".buttons").should("be.visible");
                  cy.get(".XSetMyStation").should("be.visible");
                  cy.get("a[href*='moodyradio.org']").should("be.visible");
                });

              // Test setting the second station as active
              cy.get(".station")
                .eq(1)
                .within(() => {
                  cy.get(".XSetMyStation").should("be.visible").click();
                });

              // Verify the second station is now active
              cy.get(".station")
                .eq(1)
                .within(() => {
                  cy.get(".XSetMyStation").should("have.class", "isDisabled");
                });
            });
          });
      });
  });

  it("Testing station search by state Illinois", () => {
    cy.get(".changeStation")
      .should("be.visible")
      .click()
      .then(() => {
        cy.get("body > div.Modal.FindStationModal.isOpen > div > div")
          .should("be.visible")
          .within(() => {
            // Verify the modal is open and has the correct title
            cy.get(".ModalSearch > h2").should("be.visible").should("have.text", "Find A Station");

            // Test state dropdown
            cy.get("#ddlstatesDropDown").should("be.visible").select("IL").should("have.value", "IL");

            // Click the Go button for state search
            cy.get("#FindByState").should("be.visible").click();

            // Verify the station results are displayed
            cy.get(".FindStation").within(() => {
              cy.get("h2").should("be.visible").should("have.text", "STATIONS NEAR YOU");

              // Check that stations are displayed
              cy.get(".station").should("have.length.at.least", 1);

              // Verify station structure and content
              cy.get(".station")
                .first()
                .within(() => {
                  cy.get(".name").should("be.visible");
                  cy.get(".frequency").should("be.visible");
                  cy.get(".location").should("be.visible");
                  cy.get(".buttons").should("be.visible");
                  cy.get(".XSetMyStation").should("be.visible");
                  cy.get("a[href*='moodyradio.org']").should("be.visible");
                });

              // Test setting the second station as active
              cy.get(".station")
                .eq(1)
                .within(() => {
                  cy.get(".XSetMyStation").should("be.visible").click();
                });

              // Verify the second station is now active
              cy.get(".station")
                .eq(1)
                .within(() => {
                  cy.get(".XSetMyStation").should("have.class", "isDisabled");
                });
            });
          });
      });
  });
});
