import { validateSelectors } from "../functions";

export function eduSimpleCalloutBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduSimpleCalloutBlock]()");
  const functionName = "eduSimpleCalloutBlock";

  cy.visit(url).then(() => {
    const main = {
      headline: {
        selector: `section.EDU.simple-callout-block.relative.w-full > div > div.relative.z-10 > div > div.w-full > h2`,
        content: content.headline,
      },
      description: {
        selector: `section.EDU.simple-callout-block.relative.w-screen.w-full > div > div.relative.z-10 > div > div.w-full.space-y-2 > div`,
        content: content.description,
      },
    };

    validateSelectors(main, functionName);

    content.ctaButtons?.forEach((button: any, z: number) => {
      const buttonObject = {
        text: {
          selector: `section.EDU.simple-callout-block > div > div.relative.z-10 > div > div.flex-shrink-0 > a:nth-child(${z + 1})`,
          content: button?.text,
        },
        linkUrl: {
          selector: `section.EDU.simple-callout-block > div > div.relative.z-10 > div > div.flex-shrink-0 > a:nth-child(${z + 1})`,
          content: button?.href,
          removeQueryString: true,
        },
      };
      validateSelectors(buttonObject, functionName);
    });
  });
}
