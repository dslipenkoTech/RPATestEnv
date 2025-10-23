import { validateSelectors, getVariableFromUrl } from "../functions";

export function largeCalloutBlock(
  url: string,
  content: any,
  i: number,
  pageTypeObject: any,
  isLayoutBlock: boolean,
  functionName: string,
  j: number
) {
  cy.log("[LayoutBlock > LargeCalloutBlock]()");

  cy.visit(url).then(() => {
    getVariableFromUrl().then((env) => {
      const main = {
        heading: {
          selector: `div:nth-child(${i}) > div > section:nth-child(${j + 1}) > div > div > h2`,
          content: content.calloutHeading,
        },
        subheading: {
          selector: `div:nth-child(${i}) > div > section:nth-child(${j + 1}) > div > div > p`,
          content: content.calloutSubheading,
        },
        imageUrl: {
          selector: `div:nth-child(${i}) > div > section:nth-child(${j + 1}) > picture > img`,
          content: content.image?.url,
          attribute: "src",
          removeQueryString: true,
        },
      };
      validateSelectors(main, `${functionName} > LargeCalloutBlock`);
    });
  });
}
