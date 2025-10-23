import { validateSelectors } from "../functions";

export function checkErrorPage(content: any) {
  cy.log("[CheckErrorPage]()");
  const functionName = "checkErrorPage";

  cy.visit(content.body.url).then(() => {
    const main = {
      name: {
        selector: `section > div > div.order-5 > h1`,
        content: content.body.name,
      },
      mainBodyMarkup: {
        selector: `div.container.mx-auto > div > main > section > div > section > div`,
        content: content.body.page.mainBodyMarkup,
      },
    };

    if (content.body.routeSegment?.includes("error")) {
      validateSelectors(main, functionName);
    }
  });
}
