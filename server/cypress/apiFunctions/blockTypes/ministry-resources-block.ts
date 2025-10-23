import { validateSelectors, pagination } from "../functions";

export function ministryResourcesBlock(url: string, content: any, i: number) {
  cy.log("[MinistryResourcesBlock]()");
  const functionName = "ministryResourcesBlock";

  cy.visit(url).then(() => {
    const name = {
      heading: {
        selector: `section:nth-child(${i}) > div > div.mb-6 > div > h2`,
        content: content.heading,
      },
      description: {
        selector: `section:nth-child(${i}) > div > div.mb-6 > div.text-sm`,
        content: content.description,
      },
      viewAllButton: {
        selector: `section:nth-child(${i}) > div > div.relative > a`,
        content: content.viewAllLink?.text,
      },
      viewAllButtonUrl: {
        selector: `section:nth-child(${i}) > div > div.relative > a`,
        content: content.viewAllLink?.href,
      },
    };
    validateSelectors(name, functionName);

    content.multilinkCards.forEach((cardContent: any, j: number) => {
      const card = {
        heading: {
          selector: `section:nth-child(${i}) > div > div.relative > section > div > div > div:nth-child(${j + 1}) > div > div > h4`,
          content: cardContent.heading,
        },
        imageUrl: {
          selector: `section:nth-child(${i}) > div > div.relative > section > div > div > div:nth-child(${
            j + 1
          }) > div > div > div >  picture > img`,
          content: cardContent.image?.url,
          attribute: "src",
          removeQueryString: true,
        },
      };
      validateSelectors(card, functionName);

      //^ Pagination
      const nextBtn = `section:nth-child(${i}) > div > div.relative > section > nav > button:nth-child(3)`;
      pagination(nextBtn, 3, "Next Button", j, content.multilinkCards, functionName);

      cardContent.links.forEach((linkContent: any, k: number) => {
        const link = {
          linkUrl: {
            selector: `section:nth-child(${i}) > div > div.relative > section > div > div > div:nth-child(${
              j + 1
            }) > div > div:nth-child(2) > a:nth-child(${k + 1})`,
            content: linkContent.href,
          },
          text: {
            selector: `section:nth-child(${i}) > div > div.relative > section > div > div > div:nth-child(${
              j + 1
            }) > div > div:nth-child(2) > a:nth-child(${k + 1}) > span`,
            content: linkContent.text,
          },
          arrow: {
            selector: `section:nth-child(${i}) > div > div.relative > section > div > div > div:nth-child(${
              j + 1
            }) > div > div:nth-child(2) > a:nth-child(${k + 1}) > svg`,
            content: true,
            function: "visible",
          },
        };
        validateSelectors(link, functionName);
      });
    });
  });
}
