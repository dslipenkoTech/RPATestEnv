import { compareSelectors, validateSelectors } from "../functions";

export function searchPageBlock(url: string, content: any) {
  cy.log("[SearchPageBlock]()");
  const functionName = "SearchPageBlock";

  cy.visit(url).then(() => {
    //^ Popular Search Terms
    cy.get("body").should("contain", "Popular Search Terms");
    cy.get("body").should("contain", "All");

    content.popularSearchTerms.terms.forEach((term: any, j: number) => {
      const termObject = {
        term: {
          selector: `.lg\\:col-span-3 > :nth-child(2) > .flex > :nth-child(${j + 1})`,
          content: term,
        },
      };
      validateSelectors(termObject, functionName);
    });

    //^ Search Bar
    const searchBar = {
      searchTermPlaceholder: {
        selector: `#search-input`,
        content: content.searchTermPlaceholder,
        attribute: "placeholder",
      },
      badResultsMessage: {
        selector: `div.col-span-8 > div:nth-child(7) > div > div`,
        content: content.badResultsMessage,
      },
      cancelButton: {
        selector: `main > div > div.col-span-8 > div.mb-4.md\\:mb-8 > div > button.absolute.bottom-0.right-\\[15px\\].top-0`,
      },
    };
    compareSelectors(searchBar.badResultsMessage.selector, searchBar.badResultsMessage.content);

    // Cypress test for search input
    cy.get(searchBar.searchTermPlaceholder.selector)
      .should("have.attr", searchBar.searchTermPlaceholder.attribute, searchBar.searchTermPlaceholder.content)
      .type("Test")
      .should("have.value", "Test");

    // Clear the input and type a new search term
    cy.get(searchBar.searchTermPlaceholder.selector).clear().type("New Search Term").should("have.value", "New Search Term");

    // Erasing the input by pressing the cancel button and typing a new search term
    cy.get(searchBar.searchTermPlaceholder.selector)
      .type("Another Test")
      .then(() => {
        cy.get(searchBar.cancelButton.selector)
          .click()
          .then(() => {
            cy.get(searchBar.searchTermPlaceholder.selector).should("have.value", "");
          })
          .type("New Search Term")
          .should("have.value", "New Search Term");
      });
  });
}
