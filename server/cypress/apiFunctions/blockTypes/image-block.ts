import { validateSelectors } from "../functions";

export function imageBlock(url: string, content: any, i: number) {
  cy.log("[ImageBlock]()");
  const functionName = "imageBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `main > section:nth-child(${i}) > div > div.header-wrapper > h2`,
        content: content.heading,
        attribute: "text",
      },
      subheading: {
        selector: `main > section:nth-child(${i}) > div > div.header-wrapper > div`,
        content: content.subheading,
        attribute: "text",
      },
      imageUrl: {
        selector: `main > section:nth-child(${i}) > div > picture > img`,
        content: content.image.url,
        attribute: "src",
        removeQueryString: true,
      },
      description: {
        selector: `main > section:nth-child(${i}) > div > div.description > section > div`,
        content: content.description,
      },
    };

    validateSelectors(main, functionName);
  });
}
