import { validateSelectors } from "../functions";

export function eduStatisticsBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduStatisticsBlock]()");
  const functionName = "eduStatisticsBlock";

  // wait for 8 seconds to load the page for statistics numbers
  cy.visit(url)
    .wait(8000)
    .then(() => {
      const main = {
        headline: {
          selector: `section:nth-child(${i}) > div > div.pb-5 > div > h2`,
          content: content.headline,
        },
      };
      validateSelectors(main, functionName);

      content.cards?.forEach((card: any, y: number) => {
        const cardObject = {
          number: {
            selector: `section:nth-child(${i}) > div > div.grid.grid-cols-1> div:nth-child(${y + 1}) > section > div.font-georgia`,
            content: card.number,
          },
          description: {
            selector: `section:nth-child(${i}) > div > div.grid.grid-cols-1> div:nth-child(${y + 1}) > section > div.text-sm`,
            content: card.description,
          },
        };

        validateSelectors(cardObject, functionName);
      });
    });
}
