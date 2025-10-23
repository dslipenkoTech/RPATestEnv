import { validateSelectors } from "../functions";

export function heroBlock(url: string, content: any) {
  cy.log("[HeroBlock]()");
  const functionName = "mbiHeroBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: "section.MBI.hero > div > div > div > h1",
        content: content.heading,
      },
      subheading: {
        selector: "section.MBI.hero > div > div > div > p",
        content: content.subheading,
      },
      imageUrl: {
        selector: "section.MBI.hero.bg-light-blue-900 > picture > img",
        content: content.desktopImage?.url,
        attribute: "src",
        removeQueryString: true,
      },
    };

    content.buttons.forEach((button: any, j: number) => {
      const btnSelectors = {
        buttonUrl: {
          selector: `section.MBI.hero.bg-light-blue-900> div > div > div > div > a:nth-child(${j + 1})`,
          content: button?.href,
          function: "include",
          attribute: "href",
        },
        button: {
          selector: `section.MBI.hero.bg-light-blue-900> div > div > div > div > a:nth-child(${j + 1})`,
          content: button.text,
        },
      };
      validateSelectors(btnSelectors, functionName);
    });
    validateSelectors(main, functionName);
  });
}
