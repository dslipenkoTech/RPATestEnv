import { validateSelectors } from "../functions";

export function accordionBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[AccordionBlock]()");
  const functionName = "accordionBlock";

  cy.visit(url).then(() => {
    const main = {
      headline: {
        selector: `section > div.flex.flex-col.space-y-2.lg\\:space-y-3.lg\\:max-w-\\[632px\\].mb-5 > h2`,
        content: content.headline,
      },
      description: {
        selector: `section > div.flex.flex-col.space-y-2.lg\\:space-y-3.lg\\:max-w-\\[632px\\].mb-5 > div.subheading-class.text-sm.md\\:text-base`,
        content: content.description,
      },
    };

    validateSelectors(main, functionName);

    content.items?.forEach((item: { title: string; description: string }, y: number) => {
      const bullet =
        pageTypeObject.pageType === "EduDirectoryLandingPage"
          ? `#moodyedu-app > div > div > main > div.container.mx-auto > section:nth-child(${i}) > div:nth-child(${y + 1})`
          : `#moodyedu-app > div > div > main > div.container.mx-auto > main > div > section > div:nth-child(${y + 2})`;
      cy.get(`${bullet} > button`).click();

      const itemObject = {
        title: {
          selector: `${bullet} > button > span`,
          content: item.title,
        },
        description: {
          selector: `${bullet} > div `,
          content: item.description,
        },
      };
      validateSelectors(itemObject, functionName);
    });
  });
}
