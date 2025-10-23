import { validateSelectors } from "../functions";

export function eduErrorPageBlock(url: string, content: any, i: number, pageTypeObject: string) {
  cy.log("[EduErrorPageBlock]()");
  const functionName = "eduErrorPageBlock";

  cy.visit(url).then(() => {
    const main = {
      mainBodyMarkup: {
        selector: `#moodyedu-app > div > div > div > div.container.mx-auto > div > main > div > section > div > section > div`,
        content: content.mainBodyMarkup,
      },
    };
    validateSelectors(main, functionName);
  });
}
