import { validateSelectors, viewPort } from "../functions";

export function titwLandingPageHeroBlock(url: string, content: any) {
  cy.log("[TitwLandingPageHeroBlock]()");
  const functionName = "titwLandingPageHeroBlock";
  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `h1`,
        content: content.heading,
      },
      subheading: {
        selector: `section.TITW.hero > div > div > div > p`,
        content: content.subheading,
      },
      desktopImageUrl: {
        selector: `section.TITW.hero > picture > img`,
        content: content.desktopImage?.url,
        attribute: "src",
        removeQueryString: true,
      },
    };
    validateSelectors(main, functionName);

    // Image for mobile
    viewPort
      .phone()
      .then(() => {
        const mobileImageUrl = {
          selector: main.desktopImageUrl.selector,
          content: content.mobileImage?.url,
          attribute: "src",
          removeQueryString: true,
        };
        validateSelectors(mobileImageUrl, functionName);
      })
      .then(() => viewPort.reset());

    content.buttons.forEach((btnContent: any, j: number) => {
      const buttons = {
        text: {
          selector: `section.TITW.hero > div > div > div > div > a:nth-child(${j + 1})`,
          content: btnContent.text,
        },
        btnUrl: {
          selector: `section.TITW.hero > div > div > div > div > a:nth-child(${j + 1})`,
          content: btnContent.href,
          removeQueryString: true,
        },
      };
      validateSelectors(buttons, functionName);
    });
  });
}
