import { validateSelectors } from "../functions";

export function eduLandingHeroBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduLandingHeroBlock]()");
  const functionName = "eduLandingHeroBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `div.EDU.landing-hero.relative > div.gradient.absolute.bottom-0 > div > div.w-full.space-y-2 > h1`,
        content: content.heading,
      },
      subheading: {
        selector: `div.EDU.landing-hero.relative > div.gradient.absolute.bottom-0 > div > div.w-full.space-y-2 > div`,
        content: content.subheading,
        fail: "notVisible",
      },
      imageUrl: {
        selector: `div.EDU.landing-hero.relative > div > img`,
        content: content.type === "image" && content.backgroundImage?.url,
        removeQueryString: true,
        attribute: "src",
      },
    };
    validateSelectors(main, functionName);

    content.links?.forEach((link: { text: string; href: string }, y: number) => {
      const linkObject = {
        text: {
          selector: `div.EDU.landing-hero.relative > div.gradient.absolute.bottom-0 > div > div.flex.flex-col.space-x-0 > a:nth-child(${
            y + 1
          }) > span`,
          content: link.text,
        },
        linkUrl: {
          selector: `div.EDU.landing-hero.relative > div.gradient.absolute.bottom-0 > div > div.flex.flex-col.space-x-0 > a:nth-child(${
            y + 1
          })`,
          content: link.href,
          removeQueryString: true,
        },
      };
      validateSelectors(linkObject, functionName);
    });
  });
}
