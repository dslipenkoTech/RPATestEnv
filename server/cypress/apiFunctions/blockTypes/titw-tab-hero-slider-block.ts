import { getVariableFromUrl, validateSelectors } from "../functions";
import { RichTextBlock, FullWidthCalloutBlock, CtaWithInputBlock, TitwSmallCalloutGridBlock } from "./index";

export function titwTabHeroSliderBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[TitwTabHeroSliderBlock]()");
  const functionName = "titwTabHeroSliderBlock";

  cy.visit(url).then(() =>
    getVariableFromUrl().then((env) => {
      const hero = {
        heading: {
          selector: `section.${env}.tab-hero-slider > div > div > div.relative > div.relative.flex > div > h2`,
          content: content.heroHeading,
        },
        subheading: {
          selector: `section.${env}.tab-hero-slider > div > div > div.relative > div.relative.flex > div > div.text-grey-500`,
          content: content.heroSubheading,
        },
        imageUrl: {
          selector: `section.${env}.tab-hero-slider > div > div > div.relative > div.absolute.aspect-square > img`,
          content: content.heroImage?.url,
          attribute: "src",
          fail: "emptyAttribute",
        },
      };
      validateSelectors(hero, functionName);

      // Buttons
      content.heroButtons.forEach((button: any, j: number) => {
        const heroButton = {
          button: {
            selector: `section.${env}.tab-hero-slider > div > div > div.mb-8 > div.relative > div > div.lg-10 > a:nth-child(${j + 1})`,
            content: button.text,
          },
          buttonUrl: {
            selector: `section.${env}.tab-hero-slider > div > div > div.mb-8 > div.relative > div > div.lg-10 > a:nth-child(${j + 1})`,
            content: button.href,
            removeQueryString: true,
            fail: "noUrl",
          },
        };
        validateSelectors(heroButton, functionName);
      });

      content.tabs.forEach((tab: any, j: number) => {
        // Pagination
        const nextBtn = `section.${env}.tab-hero-slider > div > div > div.mx-auto > section > nav > button:nth-child(3)`;
        //pagination(nextBtn, 4, "Right Arrow", j, content.tabs, functionName);
        cy.clickElement(`section.${env}.tab-hero-slider > div > div > div.mx-auto> section > div > div > div:nth-child(${j + 1}) > div`);

        const tabElements = {
          title: {
            selector: `section.${env}.tab-hero-slider > div > div > div.mx-auto > section > div > div > div:nth-child(${
              j + 1
            }) > div > div > div.line-clamp-2`,
            content: tab.title,
          },
          subheading: {
            selector: `section.${env}.tab-hero-slider > div > div > div.mx-auto > section > div > div > div:nth-child(${
              j + 1
            }) > div > div > div.line-clamp-4`,
            content: tab.subheading,
            fail: "noText",
          },
        };
        validateSelectors(tabElements, functionName);

        tab.content.forEach((tabContent: any, k: number) => {
          let itemContentType = tabContent.model.contentType.slice(-1)[0];
          let blockContent = tabContent.model;
          switch (itemContentType) {
            case "FullWidthCalloutBlock":
              FullWidthCalloutBlock(url, blockContent, i, pageTypeObject, true, functionName, j, k);
              break;

            case "RichTextBlock":
              RichTextBlock(url, blockContent, i, pageTypeObject, true, functionName, j, k);
              break;

            case "CtaWithInputBlock":
              CtaWithInputBlock(url, blockContent, i, pageTypeObject, true, functionName, j, k);
              break;

            case "TitwSmallCalloutGridBlock":
              TitwSmallCalloutGridBlock(url, blockContent, i, pageTypeObject, true, functionName, j, k);
              break;

            default:
              throw new Error(`TabContent ${itemContentType} is missing \n\BlockType: [${functionName}]()`);
          }
        });
      });
    })
  );
}
