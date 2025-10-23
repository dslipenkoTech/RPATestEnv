import { validateSelectors } from "../functions";

export function linkCardGridBlock(url: string, content: any, i: number, pageTypeObject: any) {
  const isException = pageTypeObject.pageType.includes("Exception");
  isException ? cy.log("[LinkCardGridBlockException]()") : cy.log("[LinkCardGridBlock]()");
  const functionName = isException ? "linkCardGridBlockException" : "linkCardGridBlock";

  cy.visit(url).then(() => {
    const mainSelector = !isException ? `section:nth-child(${i})` : `div:nth-child(3) div > section`;
    const main = {
      heading: {
        selector: mainSelector + ` > div > div.mb-8 > div > h2`,
        content: content.sectionHeading,
      },
      description: {
        selector: mainSelector + ` > div > div.mb-8 > div > div`,
        content: content.description,
        fail: "noText",
      },
    };
    validateSelectors(main, functionName);

    content.cards.forEach((card: any, j: number) => {
      let contentStyle = content.cardStyle === "Image Card";
      const baseUrl = `${mainSelector} > div > div.grid.gap-4 > a:nth-child(${j + 1})`;

      const example = {
        title: {
          MBI: {
            selector: baseUrl + contentStyle ? ` > div > div > div.line-clamp-2` : ` > div > div.mb-2`,
            content: card.title,
          },
          TITW: {
            selector: baseUrl + contentStyle ? ` > div.flex > div:nth-child(1)` : ` > div > div.line-clamp-2`,
            content: card.title,
          },
        },
        description: {
          MBI: {
            selector: baseUrl + contentStyle ? ` > div > div.mt-4` : ` > div > div.text-grey-700`,
            content: card.description,
          },
          TITW: {
            selector: baseUrl + contentStyle ? ` > div.flex > div.text-grey-700` : ` > div > div.text-grey-700`,
            content: card.description,
          },
        },
        cardUrl: {
          selector: baseUrl,
          content: card.link.href,
          attribute: "href",
          removeQueryString: true,
          fail: "emptyAttribute",
        },
      };
      validateSelectors(example, functionName);
    });
  });
}
