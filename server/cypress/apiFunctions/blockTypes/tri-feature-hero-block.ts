import { validateSelectors, getVariableFromUrl } from "../functions";

export function triFeatureHeroBlock(url: string, content: any, i: number) {
  cy.log("[TriFeatureHeroBlock]()");
  const functionName = "triFeatureHeroBlock";

  cy.visit(url).then(() => {
    getVariableFromUrl().then((env: string) => {
      const main = {
        heading: {
          selector: `section.bg-center.${env}.tri-feature-hero-block > div.container > div.mr-12 > h1`,
          content: content.heading,
          subHeading: {
            selector: `section.bg-center.${env}.tri-feature-hero-block > div.container > div.mr-12 > p`,
            content: content.subheading,
          },
        },
        imageUrl: {
          selector: `section.bg-center.${env}.tri-feature-hero-block`,
          content: content.imageUrl,
          attribute: `style`,
          removeWrapper: true,
          removeQueryString: true,
        },
      };
      validateSelectors(main, functionName);
      console.log("CONTENT", content);

      content.buttons.forEach((button: any, j: number) => {
        if (j > 1) return;

        const btnEl = {
          buttonText: {
            selector: `section.bg-center.${env}.tri-feature-hero-block > div.container > div > div > a:nth-child(${j + 1})`,
            content: button.text,
          },
          buttonsUrl: {
            selector: `section.bg-center.${env}.tri-feature-hero-block > div.container > div > div > a:nth-child(${j + 1})`,
            content: button.href,
          },
        };
        validateSelectors(btnEl, functionName);
      });

      content.subFeatures.forEach((subFeature: any, j: number) => {
        const subFeatureEl = {
          title: {
            selector: `section.bg-center.${env}.tri-feature-hero-block > div.container > div.flex-col > div:nth-child(${j + 1}) > h3`,
            content: subFeature.title,
          },
          linkUrl: {
            selector: `section.bg-center.${env}.tri-feature-hero-block > div.container > div.flex-col > div:nth-child(${j + 1}) > a`,
            content: subFeature.link.href,
            removeQueryString: true,
          },
        };
        validateSelectors(subFeatureEl, functionName);
      });
    });
  });
}
