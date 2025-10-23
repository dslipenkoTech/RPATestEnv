import { pagination, validateSelectors } from "../functions";

export function imageGalleryBlock(url: string, content: any, i: number) {
  cy.log("[ImageGalleryBlock]()");
  const functionName = "imageGalleryBlock";

  console.log(content);

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div > div.flex > h2`,
        content: content.heading,
      },
      subheading: {
        selector: `section:nth-child(${i}) > div > div.flex > div.subheading-class`,
        content: content.subheading,
      },
    };
    validateSelectors(main, functionName);
  });

  content.images?.forEach((image: any, y: number) => {
    const btnSelector = `section:nth-child(${i}) > div > div.relative.flex.flex-wrap> section > nav > button:nth-child(${
      y + 1
    }) > span.flex.h-5.w-5`;
    pagination(btnSelector, 3, "Next Button", y, content.images, functionName);

    const imageObject = {
      imageUrl: {
        selector: `section:nth-child(${i}) > div > div.relative.flex.flex-wrap > section > div > div > div:nth-child(${y + 1}) > img`,
        content: image.url,
        attribute: "src",
        function: "include",
      },
    };
    validateSelectors(imageObject, functionName);
  });
}
