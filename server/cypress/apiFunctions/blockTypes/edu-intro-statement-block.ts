import { validateSelectors } from "../functions";

export function eduIntroStatementBlock(url: string, content: any, i: number, pageTypeObject: string) {
  cy.log("[EduIntroStatementBlock]()");
  const functionName = "eduIntroStatementBlock";

  cy.visit(url).then(() => {
    content.link?.href && cy.get(`section:nth-child(${i}) > div > div > div.flex.w-full.flex-col > a`).scrollIntoView();

    const main = {
      title: {
        selector: `section:nth-child(${i}) > div > div > div.flex.w-full.flex-col > div > h2`,
        content: content.title,
      },
      description: {
        selector: `section:nth-child(${i}) > div > div > div.md\\:w-1\\/2.flex.w-full.flex-col.md\\:bottom-\\[3px\\].md\\:h-\\[88px\\].md\\:h-auto > div`,
        content: content.description,
      },
      link: {
        selector: `section:nth-child(${i}) > div > div > div.flex.w-full.flex-col > a > span.transition-spacing.mr-0.duration-300.ease-in-out`,
        content: content.link?.text,
      },
      linkUrl: {
        selector: `section:nth-child(${i}) > div > div > div.flex.w-full.flex-col > a`,
        content: content.link?.href,
        removeQueryString: true,
        attribute: "href",
      },
    };
    validateSelectors(main, functionName);
  });
}
