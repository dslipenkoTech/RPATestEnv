import { validateSelectors } from "../functions";

export function ministrySelectorBlock(url: string, content: any) {
  cy.log("[MinistrySelectorBlock]()");
  const functionName = "ministrySelectorBlock";

  cy.visit(url).then(() => {
    content.ministries.forEach((ministry: any, j: number) => {
      const visibleElements = {
        siteName: {
          selector: `main > div > div > a:nth-child(${j + 1}) > div.absolute.inset-x-0 > div`,
          content: ministry.siteName || ministry.text,
        },
        backgroundImgUrl: {
          selector: `main > div > div > a:nth-child(${j + 1}) > div.relative > img`,
          content: ministry.backgroundImage.url,
          attribute: "src",
          removeQueryString: true,
        },
      };
      validateSelectors(visibleElements, functionName);

      cy.get(`main > div > div > a:nth-child(${j + 1})`).trigger("mouseover");

      const hoveredElements = {
        hoverStatisticsLarge: {
          selector: `main > div > div > a:nth-child(${j + 1}) > div.absolute.inset-x-0 > div.transition > div > div.mb-3 > span.font-bold`,
          content: ministry.hoverStatisticsLarge,
        },
        hoverStatisticsSmall: {
          selector: `main > div > div > a:nth-child(${j + 1}) > div.absolute.inset-x-0 > div.transition > div > div.mb-3 > span.text-base`,
          content: ministry.hoverStatisticsSmall,
          fail: "skip",
        },
        hoverStatisticsSubheading: {
          selector: `main > div > div > a:nth-child(${j + 1}) > div.absolute.inset-x-0 > div.transition > div.text-white > div.text-base`,
          content: ministry.hoverStatisticsSubheading,
          fail: "skip",
        },
        cardUrl: {
          selector: `main > div > div > a:nth-child(${j + 1})`,
          content: ministry.href,
        },
        hoverLearnMoreText: {
          selector: `main > div > div > a:nth-child(${j + 1}) > div.absolute.inset-x-0 > div.transition > div > div.flex`,
          content: ministry.hoverLearnMoreText,
        },
      };

      validateSelectors(hoveredElements, functionName);
    });
  });
}
