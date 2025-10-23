import { validateSelectors } from "../functions";

export function eduHeroNoImageBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduHeroNoImageBlock]()");
  const functionName = "eduHeroNoImageBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `div:nth-child(${i + 1}) > section > div > div > h1`,
        content: content.heading,
      },
      subheading: {
        selector: `div:nth-child(${i + 1}) > section > div > div > p`,
        content: content.subheading,
      },
      tag: {
        selector: `div:nth-child(${i + 1}) > section > div > div > span`,
        content: content.tag,
      },
    };
    validateSelectors(main, functionName);
  });
}
