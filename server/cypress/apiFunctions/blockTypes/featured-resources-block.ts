import { validateSelectors, pagination } from "../functions";

export function featuredResourcesBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[FeaturedResourcesBlock]()");
  const functionName = "featuredResourcesBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div > div > div > h2`,
        content: content.heading,
      },
      subheading: {
        selector: `section:nth-child(${i}) > div > div > div > div.subheading-class`,
        content: content.subheading,
        fail: "noText",
      },
      viewAllButton: {
        selector: `section:nth-child(${i}) > div > div.mt-8.flex.w-full > a`,
        content: content.viewAllLink?.text,
      },
      viewAllButtonUrl: {
        selector: `section:nth-child(${i}) > div > div.mt-8.flex.w-full > a`,
        content: content.viewAllLink?.href,
        removeQueryString: true,
      },
    };
    validateSelectors(main, functionName);

    //prettier-ignore
    content.featuredResources.forEach((resource: any, j: number) => {
      const buttonNext = `section:nth-child(${i}) > div > div.flex > section > nav > button:nth-child(3)`;
      pagination(buttonNext, 4, "buttonNext", j, content.featuredResources, functionName);

      const mbiTitleExtension = resource.type ? `` : `div > `
      const titwTitleExtension = resource.type ? `div:nth-child(1) > span` : `div > div.line-clamp-2`
      const imgExtension = resource.type ? `div >` : `` 
      const descriptionExtension = resource.type ? `div.text-sm` : `div > div.text-sm`

      const resourceEl = {
        title: {
          selector: {
            MBI: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a > div > ${mbiTitleExtension} div.line-clamp-2`,
            TITW: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a > div > ${titwTitleExtension}`,
            Edu: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > section > div > div > a:nth-child(${j + 1}) > div.flex.w-full.flex-grow > div.space-y-2 > h4`
          },
          content: resource.title,
        },
        description: {
          selector: {
            MBI: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a > div > ${descriptionExtension}`,
            TITW: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a > div > ${descriptionExtension}`,
            Edu: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > section > div > div > a:nth-child(${j + 1}) > div.flex.w-full.flex-grow > div.space-y-2 > div`,
          },
          content: resource.description,
          fail: "noText",
        },
        imageUrl: {
          selector: {
            MBI: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a > ${imgExtension} img`,
            TITW: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a > ${imgExtension} img`,
            Edu: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > section > div > div > a:nth-child(${j + 1}) > div.bg-light-blue-100.relative.w-full > img`
          },
          content: resource.image?.url,
          condition: resource.image?.imageAlt,
          attribute: "src",
          removeQueryString: true,
          fail: "skip",
        },
        resourceUrl: {
          selector: {
            MBI: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a`,
            TITW: `section:nth-child(${i}) > div > div.flex > section > div > div > div:nth-child(${j + 1}) > a`,
            Edu: `section:nth-child(${i}) > div > div.flex.flex-wrap.justify-center > section > div > div > a:nth-child(${j + 1})`,
          },
          content: resource.link.href,
          removeQueryString: true,
        },
      };
      validateSelectors(resourceEl, functionName);
    });
  });
}
