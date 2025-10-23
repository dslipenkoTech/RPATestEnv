import { validateSelectors } from "../functions";

export function eduHomeHeroBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduHomeHeroBlock]()");
  const functionName = "eduHomeHeroBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: "section.Edu.home-hero > div > div.absolute.bottom-2 > div > div > h2",
        content: content.heading,
      },
      subheading: {
        selector: "section.Edu.home-hero > div > div.absolute.bottom-2 > div > div > p",
        content: content.subheading,
      },
    };
    validateSelectors(main, functionName);

    // links
    content.links.forEach((link: { title: string; href: string; text: string }, y: number) => {
      const linkObject = {
        text: {
          selector: `section.Edu.home-hero.home-hero-block > div > div.absolute > div > div > div > div > div:nth-child(${
            y + 1
          }) > a > span`,
          content: link.text,
        },
        btnUrl: {
          selector: `section.Edu.home-hero.home-hero-block > div > div.absolute > div > div > div > div > div:nth-child(${y + 1}) > a`,
          content: link.href,
          removeQueryString: true,
        },
      };
      validateSelectors(linkObject, functionName);
    });
  });
}
