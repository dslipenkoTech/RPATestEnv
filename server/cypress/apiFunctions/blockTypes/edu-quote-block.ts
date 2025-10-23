import { validateSelectors } from "../functions";

export function eduQuoteBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduQuoteBlock]()");
  const functionName = "eduQuoteBlock";

  cy.visit(url).then(() => {
    const main = {
      text: {
        selector: `section:nth-child(${i}) > div > div > p`,
        content: content.text,
      },
      quoteeName: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.text-sm.font-bold`,
        content: content.quoteeName,
      },
      quoteeDescription: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.text-sm.font-normal`,
        content: content.quoteeDescription,
      },
    };
    validateSelectors(main, functionName);
  });
}
