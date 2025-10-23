import { URLS } from "~cypress/environment";

const link = Cypress.env("Radio") as string;

describe("Testing search and related functionalities", { tags: ["@moody-radio", "@radio", "@premise"] }, () => {
  beforeEach(() => URLS(link));

  it("Search component on the home page should be visible with the correct placeholder.", () => {
    cy.get('[name="Search"]').should("be.visible").should("have.attr", "placeholder", "search");
    cy.get("#btnSearch").should("be.visible");
  });

  it("Page url should match the search query.", () => {
    cy.get('[name="Search"]').type("Hello");
    cy.get('[name="Search"]').should("have.value", "Hello");
    cy.get('[name="Search"]')
      .type("{enter}")
      .wait(1000)
      .then(() => {
        cy.url().should("include", "/search/?SearchText=Hello");
      });
  });

  it("Testing search functionality", () => {
    // Search
    cy.get('[name="Search"]').type("Hello");
    cy.get('[name="Search"]').should("have.value", "Hello");
    cy.get('[name="Search"]')
      .type("{enter}")
      .wait(1000)
      .then(() => {
        cy.get(`.find-header`).should("be.visible").should("have.text", "Moody Radio");
      });

    // Results shown
    cy.get(".filter-label").should("be.visible").should("include.text", "Results shown:");

    cy.get(".search-results > .result").should("be.visible").should("have.attr", "href").and("not.be.empty");

    // Related Headers
    cy.get(".related-results")
      .should("be.visible")
      .within(() => {
        cy.get(".related-header").should("be.visible");
      });

    // Test all-results container
    cy.get(".all-results").should("be.visible").should("exist");

    // Test individual result items
    cy.get(".all-results .result")
      .should("have.length.at.least", 1)
      .each(($result) => {
        // Test result link attributes
        cy.wrap($result).should("have.attr", "href").and("not.be.empty");
        cy.wrap($result).should("have.attr", "target", "_blank");
        cy.wrap($result).should("have.class", "result--publishers");
        cy.wrap($result).should("have.class", "has-date");

        // Test result-main content
        cy.wrap($result).within(() => {
          cy.get(".result-main")
            .should("be.visible")
            .within(() => {
              // Test result title
              cy.get(".result-title").should("be.visible").should("not.be.empty");

              // Test result subheader (author)
              cy.get(".result-subheader").should("be.visible").should("not.be.empty");

              // Test price-type elements
              cy.get(".result-price-type")
                .should("have.length.at.least", 1)
                .each(($priceType) => {
                  cy.wrap($priceType).within(() => {
                    cy.get(".type").should("be.visible").should("not.be.empty");
                    cy.get(".price").should("be.visible").should("not.be.empty");
                  });
                });

              // Test result content and description
              cy.get(".result-content")
                .should("be.visible")
                .within(() => {
                  cy.get(".result-desc").should("be.visible").should("not.be.empty");
                });
            });

          // Test result-source-info
          cy.get(".result-source-info")
            .should("be.visible")
            .within(() => {
              cy.get(".result-source").should("be.visible").should("have.text", "moodypublishers.com");
            });
        });
      });
  });

  it("Queries with ambiguous words should not display any results.", () => {
    cy.get('[name="Search"]').type("feokfwe");
    cy.get('[name="Search"]').should("have.value", "feokfwe");
    cy.get('[name="Search"]')
      .type("{enter}")
      .wait(1000)
      .then(() => {
        cy.get(".filter-label").should("not.exist");
        cy.get(".result-source-info").should("not.exist");
      });
  });

  it("Search for 'gospel music' should load within 10 seconds", () => {
    const startTime = Date.now();
    const searchQuery = "gospel music";

    cy.get('[name="Search"]').type(searchQuery);
    cy.get('[name="Search"]').should("have.value", searchQuery);
    cy.get('[name="Search"]')
      .type("{enter}")
      .then(() => {
        const endTime = Date.now();
        const loadTime = endTime - startTime;

        // Fail the test if loading takes longer than 6 seconds
        expect(loadTime).to.be.lessThan(10000, `Search query ${searchQuery} took ${loadTime} milliseconds. It should be under 10 seconds`);

        // Verify search results are displayed
        cy.get(".filter-label").should("be.visible").should("include.text", "Results shown:");
        cy.get(".search-results > .result").should("be.visible");
      });
  });

  it("Search for 'bible study' should load within 10 seconds", () => {
    const startTime = Date.now();
    const searchQuery = "bible study";

    cy.get('[name="Search"]').type(searchQuery);
    cy.get('[name="Search"]').should("have.value", searchQuery);
    cy.get('[name="Search"]')
      .type("{enter}")
      .then(() => {
        const endTime = Date.now();
        const loadTime = endTime - startTime;

        // Fail the test if loading takes longer than 10 seconds
        expect(loadTime).to.be.lessThan(10000, `Search query ${searchQuery} took ${loadTime} milliseconds. It should be under 10 seconds`);

        // Verify search results are displayed
        cy.get(".filter-label").should("be.visible").should("include.text", "Results shown:");
        cy.get(".search-results > .result").should("be.visible");
      });
  });
});
