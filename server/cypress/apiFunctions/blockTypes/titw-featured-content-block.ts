import { validateSelectors } from "../functions";

export function titwFeaturedContentBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[TitwFeaturedContentBlock]()");
  const functionName = "titwFeaturedContentBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div > div.header-wrapper > h2`,
        content: content.calloutHeading,
      },
      subheading: {
        selector: `section:nth-child(${i}) > div > div.header-wrapper > div`,
        content: content.calloutSubheading,
      },
    };
    validateSelectors(main, functionName);

    content.upcomingFeatures.forEach((feature: any, j: number) => {
      const upcomingFeatureSelector = {
        imgTitle: {
          selector: `section:nth-child(${i}) > div > div.mt-5> div:nth-child(${j + 1}) > div:nth-child(2) > a`,
          content: feature.title,
        },
        imgUrl: {
          selector: `section:nth-child(${i}) > div > div.mt-5 > div:nth-child(${j + 1}) > div.mb-3 > a`,
          content: feature.link.href,
          removeQueryString: true,
        },
      };
      validateSelectors(upcomingFeatureSelector, functionName);
    });
  });
}
