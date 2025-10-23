import { validateSelectors } from "../functions";

export function eduStudentLifeFeatureBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduStudentLifeFeatureBlock]()");
  const functionName = "eduStudentLifeFeatureBlock";

  const main = {
    heading: {
      selector: `section:nth-child(${i}) > div > div.flex.flex-col.justify-between > div.flex.w-full > div > h2`,
      content: content.heading,
    },
    description: {
      selector: `section:nth-child(${i}) > div > div.flex.flex-col.justify-between > div.flex.w-full > div > div`,
      content: content.description,
    },
    viewAllButtonText: {
      selector: `section:nth-child(${i}) > div > div.flex.flex-col.justify-between > div.group.flex > a > span.transition-spacing.mr-0.duration-300`,
      content: content.viewAllLink?.text,
    },
    viewAllButtonUrl: {
      selector: `section:nth-child(${i}) > div > div.flex.flex-col.justify-between > div.group.flex > a`,
      content: content.viewAllLink?.href,
      removeQueryString: true,
    },
  };
  validateSelectors(main, functionName);

  content.featuredPages.forEach((page: any, y: number) => {
    const pageObject = {
      title: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div > div:nth-child(${
          y + 1
        }) > a > div > div > div:nth-child(1) > div.font-georgia.text-grey-800.line-clamp-2`,
        content: page.title,
      },
      description: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div > div:nth-child(${
          y + 1
        }) > a > div > div > div:nth-child(1) > div.text-grey-700.mt-4.line-clamp-3`,
        content: page.description,
      },
      imageUrl: {
        selector: `#moodyedu-app > div > div > main > section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div > div:nth-child(${
          y + 1
        }) > a > img`,
        content: page.image?.url,
        removeQueryString: true,
        attribute: "src",
      },
      linkText: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div > div:nth-child(${
          y + 1
        }) > a > div > div > div.align-center.mt-2.flex > span.transition-spacing.mr-0.duration-300`,
        content: page.link?.text,
      },
      linkUrl: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div > div:nth-child(${y + 1}) > a`,
        content: page.link?.href,
        removeQueryString: true,
      },
    };

    validateSelectors(pageObject, functionName);
  });
}
