import { validateSelectors, viewPort } from "../functions";

export function mbiHomePageHeroBlock(url: string, content: any) {
  cy.log("[mbiHomePageHeroBlock]()");
  const functionName = "mbiHomePageHeroBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section.home-hero > div.container > div > h1`,
        content: content.heading,
      },
      subheading: {
        selector: `section.home-hero > div.container > div > p`,
        content: content.subheading,
      },
      button: {
        selector: `section.home-hero > div.container > div > button`,
        content: content.videoShareLink,
        function: "visible",
      },
      desktopImageUrl: {
        selector: `section.home-hero`,
        content: content.desktopImage.url,
        attribute: "style",
        function: "include",
      },
    };
    validateSelectors(main, functionName);

    // Mobile image
    viewPort
      .phone()
      .then(() => {
        const mobileImageUrl = {
          selector: main.desktopImageUrl.selector,
          content: content.mobileImage?.url,
          attribute: "src",
          function: "include",
        };
        validateSelectors(mobileImageUrl, functionName);
      })
      .then(() => viewPort.reset());

    content.resourcesLinks.forEach((resourceLink: any, j: number) => {
      //^ Resources Links
      const resources = {
        itemTitle: {
          selector: `section.home-hero > div.container div > div > div > div:nth-child(${j + 1}) > a`,
          content: resourceLink.text,
        },
        itemUrl: {
          selector: `section.home-hero > div.container div > div > div > div:nth-child(${j + 1}) > a`,
          content: resourceLink.href,
        },
      };
      validateSelectors(resources, functionName);
    });
  });
}
