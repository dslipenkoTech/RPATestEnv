import { validateSelectors } from "../functions";

export function eduAcademicsBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduAcademicsBlock]()");
  const functionName = "eduAcademicsBlock";

  const main = {
    headline: {
      selector: `section:nth-child(${i}) > div > div.mb-6 > div.flex.w-full > div > h2`,
      content: content.headline,
    },
    description: {
      selector: `section:nth-child(${i}) > div > div.mb-6 > div.flex.w-full > div > div`,
      content: content.description,
    },
    allAcademicsLinkText: {
      selector: `section:nth-child(${i}) > div > div.mb-6 > div.flex.w-full > a > span`,
      content: content.allAcademicsLink?.text,
    },
    allAcademicsLinkUrl: {
      selector: `section:nth-child(${i}) > div > div.mb-6 > div.flex.w-full > a`,
      content: content.allAcademicsLink?.href,
      removeQueryString: true,
    },
  };
  validateSelectors(main, functionName);

  content.academicFeaturedContent.forEach((item: any, y: number) => {
    // Go through each tab
    cy.get(`section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div.mb-4.flex.h-full > button:nth-child(${y + 1})`).click();

    const academicFeaturedContent = {
      title: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div.stack.w-full > div:nth-child(${
          y + 1
        }) > div > div > div.text-grey-800.font-georgia.line-clamp-2`,
        content: item.title,
      },
      description: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div.stack.w-full > div:nth-child(${
          y + 1
        }) > div > div > div.text-grey-800.mt-4.line-clamp-4`,
        content: item.description,
      },
      label: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div.mb-4.flex.h-full > button:nth-child(${y + 1})`,
        content: item.label,
      },
      imgUrl: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div.stack.w-full > div:nth-child(${y + 1}) > img`,
        content: item.image?.url,
        removeQueryString: true,
        attribute: "src",
      },
      linkText: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div.stack.w-full > div:nth-child(${
          y + 1
        }) > div > div > a > span.transition-spacing.mr-0.duration-300`,
        content: item.link?.text,
      },
      linkUrl: {
        selector: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > div.stack.w-full > div:nth-child(${
          y + 1
        }) > div > div > a`,
        content: item.link?.href,
        removeQueryString: true,
      },
    };
    validateSelectors(academicFeaturedContent, functionName);
  });
}
