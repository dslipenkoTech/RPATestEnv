import { validateSelectors } from "../functions";

export function titwLandingPageBlock(url: string, content: any) {
  cy.log(`[TitwLandingPageBlock]() `);
  const functionName = "titwLandingPageBlock";

  cy.visit(url).then(() => {
    const main = {
      cardTitle: {
        selector: `main > div > div > h1`,
        content: content.title,
      },
    };
    validateSelectors(main, functionName);
  });
}
