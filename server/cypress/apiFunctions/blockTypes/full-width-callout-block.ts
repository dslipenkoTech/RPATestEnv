import { validateSelectors, getVariableFromUrl } from "../functions";

export function fullWidthCalloutBlock(
  url: string,
  content: any,
  i = 0,
  pageTypeObject: any,
  skipVisit = false,
  parentFunction: any,
  j: number,
  k: number
) {
  cy.log("[FullWidthCalloutBlock]()");
  const functionName = "fullWidthCalloutBlock";

  if (!skipVisit) cy.visit(url);
  cy.then(() => {
    getVariableFromUrl().then((env: string) => {
      // prettier-ignore
      const selectors: any = {
        titwTabHeroSliderBlock: {
        heading: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${j + 1}) > div > section:nth-child(${k + 1}) > div > div > h2`,
        subheading: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${j + 1}) > div > section:nth-child(${k + 1}) > div > div > p`,
        button: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${j + 1}) > div > section:nth-child(${k + 1}) > div > div > a`,
        buttonUrl: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${j + 1}) > div > section:nth-child(${k + 1}) > div > div > a`,
        imageUrl: `section.${env}.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${j + 1}) > div > section:nth-child(${k + 1}) > div > picture > img`,
      },
    };
      const main = {
        heading: {
          selector: parentFunction ? selectors[parentFunction].heading : `section:nth-child(${i}) > div > div > h2`,
          content: content.calloutHeading,
        },
        subheading: {
          selector: parentFunction ? selectors[parentFunction].subheading : `section:nth-child(${i}) > div > div > p`,
          content: content.calloutSubheading,
        },
        button: {
          selector: parentFunction ? selectors[parentFunction].button : `section:nth-child(${i}) > div > div > a`,
          content: content.calloutButton.text,
        },
        buttonUrl: {
          selector: parentFunction ? selectors[parentFunction].buttonUrl : `section:nth-child(${i}) > div > div > a`,
          content: content.calloutButton.href,
          removeQueryString: true,
        },
        imageUrl: {
          selector: parentFunction ? selectors[parentFunction].imageUrl : `section:nth-child(${i}) > div > picture > img`,
          content: content.image?.url,
          attribute: "src",
          removeQueryString: true,
        },
      };
      validateSelectors(main, functionName);
    });
  });
}
