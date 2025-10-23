import { validateSelectors } from "../functions";

export function featuredContentBlock(url: string, content: any, i: number) {
  cy.log("[FeaturedContentBlock]()");
  const functionName = "featuredContentBlock";

  cy.visit(url).then(() => {
    //^ Heading and subheading
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div > div.mb-6 > div > h2`,
        content: content.heading,
      },
      subheading: {
        selector: `section:nth-child(${i}) > div > div.mb-6 > div > div`,
        content: content.subheading,
      },
    };
    validateSelectors(main, functionName);

    content.featuredResources.forEach((resource: any, j: number) => {
      //^ Featured resource: title, description, url
      const resourceSelectors = {
        title: {
          selector: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${
            j + 1
          }) > a > div.flex > div:nth-child(1) > span`,
          content: resource.title,
        },
        description: {
          selector: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${
            j + 1
          }) > a > div.flex > div.text-grey-700.line-clamp-3.min-h-16.flex-grow.text-sm.font-normal`,
          content: resource.description,
        },
        selectorUrl: {
          selector: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a`,
          content: resource.link?.href,
          removeQueryString: true,
        },
      };

      //^ Pagination
      if (j + 1 === 5 || j + 1 === 10) {
        cy.clickElement(`main > section:nth-child(${i}) > div > div.flex > section > nav > button:nth-child(3)`);
      }
      validateSelectors(resourceSelectors, functionName);
    });
  });
}
