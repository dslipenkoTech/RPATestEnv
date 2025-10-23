import { validateSelectors } from "../functions";

export function eduFeaturedLinkBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduFeaturedLinkBlock]()");
  const functionName = "eduFeaturedLinkBlock";

  cy.visit(url).then(() => {
    const main = {
      title: {
        selector: `section.Edu.featured-link-block.relative > div.flex.flex-col.space-y-2 > h2`,
        content: content.title || content.heading,
      },
      description: {
        selector: `section.Edu.featured-link-block.relative > div.flex.flex-col.space-y-2 > div.subheading-class.text-sm`,
        content: content.description || content.subheading,
      },
      imageUrl: {
        selector: `section.Edu.featured-link-block.relative > div > div > picture > img`,
        content: content.image?.url,
        attribute: "src",
        removeQueryString: true,
      },
    };
    validateSelectors(main, functionName);

    content.links.forEach((link: { title: string; description: string; link: { href: string } }, y: number) => {
      const linkObject = {
        title: {
          selector: `section.Edu.featured-link-block.relative > div.lg\\:grid > div.space-y-2 > div > h5`,
          content: link.title,
        },
        description: {
          selector: `section.Edu.featured-link-block.relative > div.lg\\:grid > div.space-y-2 > div > div`,
          content: link.description,
        },
        linkUrl: {
          selector: `section.Edu.featured-link-block.relative > div.lg\\:grid > div.space-y-2 > div > a`,
          content: link.link?.href,
          removeQueryString: true,
        },
      };
      validateSelectors(linkObject, functionName);
    });
  });
}
