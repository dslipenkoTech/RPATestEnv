import { validateSelectors } from "../functions";

export function eduSearchPageBlock(url: string, content: any, i: number, pageTypeObject: string) {
  cy.log("[EduSearchPageBlock]()");
  const functionName = "eduSearchPageBlock";

  cy.visit(url).then(() => {
    const main = {
      searchIconAltText: {
        selector: `#moodyedu-app > div > div > main > div > div.col-span-12 > div > div > button`,
        content: content.searchIconAltText,
        attribute: "aria-label",
      },
      searchPlaceholder: {
        selector: `#search-input`,
        content: content.searchPlaceholder,
        attribute: "placeholder",
      },
    };
    validateSelectors(main, functionName);

    // Test input
    cy.get("#search-input").type("test");
    cy.get("#search-input").should("have.value", "test");

    // Test clear all
    cy.get(`div.col-span-12 > div > div > button.absolute.bottom-0.right-\\[15px\\]`).click();
    cy.get("#search-input").should("have.value", "");

    // Typing a failed search
    cy.get("#search-input").type("sfjkokdf");
    cy.get(`div.col-span-12 > div > div > button.absolute.bottom-0.left-\\[15px\\]`).click().wait(2000);

    cy.get(`#moodyedu-app > div > div > main > div > div.col-span-9 > div > div > div > div`).should(
      "have.text",
      `No results for “sfjkokdf” . Please try again.`
    );
  });
}
