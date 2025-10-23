import { validateSelectors } from "../functions";

export function eduUniversalStoriesBlock(url: string, content: any, i = 0, pageTypeObject: any, skipVisit = false) {
  cy.log("[EduUniversalStoriesBlock]()");
  const functionName = "eduUniversalStoriesBlock";

  if (!skipVisit) cy.visit(url);
  cy.then(() => {
    const main = {
      heading: {
        selector: `div.full-width-content-area.mt-8.space-y-8 > div > div.flex.flex-col.space-y-2 > h2`,
        content: content.heading,
      },
      subheading: {
        selector: `div.full-width-content-area.mt-8.space-y-8 > div > div.flex.flex-col.space-y-2 > div.subheading-class.text-sm`,
        content: content.subheading,
      },
    };
    validateSelectors(main, functionName);

    content.cards?.forEach((card: any, y: number) => {
      // Only include Radio, Conferences, and TITW cards
      if (card.ministryTag !== "Radio" || card.ministryTag !== "Conferences" || card.ministryTag !== "TITW") return;

      const cardObject = {
        title: {
          selector: `div.full-width-content-area.mt-8.space-y-8 > div > div.mt-5.grid.grid-cols-1.gap-y-5 > a:nth-child(${
            y + 1
          }) > div.border-grey-100.flex.h-full > div > div:nth-child(1) > h6`,
          content: card.title,
        },
        description: {
          selector: `div.full-width-content-area.mt-8.space-y-8 > div > div.mt-5.grid.grid-cols-1.gap-y-5 > a:nth-child(${
            y + 1
          }) > div.border-grey-100.flex.h-full > div > div:nth-child(1) > div`,
          content: card.description,
        },
        imageUrl: {
          selector: `div.full-width-content-area.mt-8.space-y-8 > div > div.mt-5.grid.grid-cols-1.gap-y-5 > a:nth-child(${
            y + 1
          }) > div.relative.h-full.w-full > img`,
          content: card.image?.url,
          attribute: "src",
          removeQueryString: true,
        },
        ministryTag: {
          selector: `div.full-width-content-area.mt-8.space-y-8 > div > div.mt-5.grid.grid-cols-1.gap-y-5 > a:nth-child(${
            y + 1
          }) > div.relative.h-full.w-full > div`,
          content: card.ministryTag?.tag,
        },
        linkText: {
          selector: `div.full-width-content-area.mt-8.space-y-8 > div > div.mt-5.grid.grid-cols-1.gap-y-5 > a:nth-child(${
            y + 1
          }) > div.border-grey-100.flex.h-full > div > div.align-center.mt-2.flex.h-9.w-full > span.transition-spacing.mr-0.text-sm`,
          content: card.link?.text,
        },
        linkUrl: {
          selector: `div.full-width-content-area.mt-8.space-y-8 > div > div.mt-5.grid.grid-cols-1.gap-y-5 > a:nth-child(${y + 1})`,
          content: card.link?.href,
        },
      };
      validateSelectors(cardObject, functionName);
    });
  });
}
