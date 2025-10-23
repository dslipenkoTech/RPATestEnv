import { getVariableFromUrl, validateSelectors } from "../functions";

export function titwSmallCalloutGridBlock(
  url: string,
  content: any,
  i: number,
  pageTypeObject: any,
  skipVisit = false,
  parentFunction: any,
  j: number,
  k: number
) {
  cy.log("[TitwSmallCalloutGridBlock]()");
  const functionName = "titwSmallCalloutGridBlock";

  if (!skipVisit) cy.visit(url);
  cy.then(() => {
    getVariableFromUrl().then((env) => {
      const selectors = {
        titwTabHeroSliderBlock: {
          sectionHeading: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${
            j + 1
          }) > div > div > div.header-wrapper > h2`,
          sectionSubheading: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${
            j + 1
          }) > div > div > div.header-wrapper > div`,
        },
      };

      const main = {
        sectionHeading: {
          selector: parentFunction
            ? selectors[parentFunction as keyof typeof selectors].sectionHeading
            : `div.${env}.small-callout-grid-block > div.header-wrapper > h2`,
          content: content.sectionHeading,
        },
        sectionSubheading: {
          selector: parentFunction
            ? selectors[parentFunction as keyof typeof selectors].sectionSubheading
            : `div.${env}.small-callout-grid-block > div.header-wrapper > div`,
          content: content.sectionSubheading,
        },
      };
      validateSelectors(main, functionName);

      content.links.forEach((linkContent: any, l: number) => {
        cy.url().then((currentUrl) => {
          let path = "";
          if (linkContent.href.startsWith("~")) {
            const url = new URL(currentUrl);
            path = url.pathname;
          }

          const cardSelectors = {
            titwTabHeroSliderBlock: {
              title: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${
                j + 1
              }) > div > div > div.flex > a:nth-child(${l + 1}) > span > span.text-2xl`,
              text: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${
                j + 1
              }) > div > div > div.flex > a:nth-child(${l + 1}) > span > span.text-base`,
              cardUrl: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${
                j + 1
              }) > div > div > div.flex > a:nth-child(${l + 1})`,
            },
          };
          const card = {
            title: {
              selector: parentFunction
                ? cardSelectors[parentFunction as keyof typeof cardSelectors].title
                : `div.${env}.small-callout-grid-block > div.flex > a:nth-child(${l + 1}) > span > span.font-semibold`,
              content: linkContent.title,
            },
            text: {
              selector: parentFunction
                ? cardSelectors[parentFunction as keyof typeof cardSelectors].text
                : `div.${env}.small-callout-grid-block > div.flex > a:nth-child(${l + 1}) > span > span.font-medium`,
              content: linkContent.text,
            },
            cardUrl: {
              selector: parentFunction
                ? cardSelectors[parentFunction as keyof typeof cardSelectors].cardUrl
                : `div.${env}.small-callout-grid-block > div.flex > a:nth-child(${l + 1})`,
              content: path + linkContent.href,
              removeQueryString: true,
            },
          };
          validateSelectors(card, functionName);
        });
      });
    });
  });
}
