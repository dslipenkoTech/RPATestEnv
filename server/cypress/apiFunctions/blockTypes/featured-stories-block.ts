import { validateSelectors, pagination } from "../functions";

export function featuredStoriesBlock(url: string, content: any, i: number) {
  cy.log("[FeaturedStoriesBlock]()");
  const functionName = "featuredStoriesBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div > div.mb-6 > div > h2`,
        content: content.heading,
      },
      subheading: {
        selector: `section:nth-child(${i}) > div > div.mb-6 > div.text-sm`,
        content: content.subheading,
      },
      viewAllButton: {
        selector: `section:nth-child(${i}) > div > div > a`,
        content: content.viewAllLink?.text,
      },
      viewAllButtonUrl: {
        selector: `section:nth-child(${i}) > div > div > a`,
        content: content.viewAllLink?.href,
      },
    };
    validateSelectors(main, functionName);

    content.cards.forEach((cardContent: any, j: number) => {
      const card = {
        title: {
          selector: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${
            j + 1
          }) > a > div > div > div.line-clamp-2`,
          content: cardContent.title,
        },
        description: {
          selector: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a > div > div > div.mt-4`,
          content: cardContent.description,
          fail: "noText",
        },
        imageUrl: {
          selector: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a > img`,
          content: cardContent.image.url,
          attribute: "src",
          removeQueryString: true,
        },
        cardUrl: {
          selector: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a`,
          content: cardContent.link.href,
        },
      };
      validateSelectors(card, functionName);

      // Pagination - Click "Next" button every 3 cards
      const nextBtn = `section:nth-child(${i}) > div > div.flex > section > nav > button:nth-child(3)`;
      pagination(nextBtn, 3, "Next Button", j, content.cards, functionName);
    });
  });
}
