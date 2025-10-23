import { validateSelectors } from "../functions";

export function featuredMediaBlock(url: string, content: any, i = 0, pageTypeObject: any, skipVisit = false) {
  cy.log("[FeaturedMediaBlock]()");
  const functionName = "featuredMediaBlock";

  const envType: string = Cypress.env("ENV_TYPE");

  if (!skipVisit) cy.visit(url);
  cy.then(() => {
    let selectorExtension = content.sectionHeading ? `div:nth-child(2)` : `div`;
    let btnUrlExtension = "";

    if (content.buttonLink?.href?.startsWith("~")) {
      const newUrl = new URL(url);
      btnUrlExtension = newUrl.pathname;
    }

    const main = {
      sectionHeading: {
        selector: `section:nth-child(${i}) > div > div.mb-5 > div > h2`,
        content: content.sectionHeading,
      },
      sectionSubheading: {
        selector: `section:nth-child(${i}) > div > div > div > div`,
        content: content.sectionSubheading,
        fail: "emptyAttribute",
      },
      heading: {
        selector: `section:nth-child(${i}) > div > div > ${selectorExtension} > h2`,
        content: content.heading,
      },
      description: {
        selector:
          envType === "integration"
            ? `section:nth-child(${i}) > div > div > ${selectorExtension} > div`
            : `section:nth-child(${i}) > div > div > ${selectorExtension}  p`,
        content: content.description,
      },
      button: {
        selector: `section:nth-child(${i}) > div > div > ${selectorExtension} > a`,
        content: content.buttonLink.text,
      },
      buttonUrl: {
        selector: `section:nth-child(${i}) > div > div > ${selectorExtension} > a`,
        content: btnUrlExtension ? btnUrlExtension + content.buttonLink?.href : content.buttonLink?.href,
        removeQueryString: true,
      },
      imageUrl: {
        selector: `section:nth-child(${i}) > div > div > div > picture > img`,
        content: content.image?.url,
        attribute: "src",
        removeQueryString: true,
      },
    };
    validateSelectors(main, functionName);
  });
}
