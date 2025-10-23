import { pagination, validateSelectors } from "../functions";

export function largeSliderBlock(url: string, content: any, i: number) {
  cy.log("[LargeSliderBlock]()");
  const functionName = "largeSliderBlock";

  cy.visit(url).then(() => {
    content.slides.forEach((slide: any, j: number) => {
      const main = {
        heading: {
          selector: `section:nth-child(${i}) > div > section > div > div > section:nth-child(${j + 1}) > div > div > h2`,
          content: slide.model?.calloutHeading,
        },
        subheading: {
          selector: `section:nth-child(${i}) > div > section > div > div > section:nth-child(${j + 1}) > div > div > p`,
          content: slide.model?.calloutSubheading,
        },
        button: {
          selector: `section:nth-child(${i}) > div > section > div > div > section:nth-child(${j + 1}) > div > div > a`,
          content: slide.model?.calloutButton?.text,
        },
        buttonUrl: {
          selector: `section:nth-child(${i}) > div > section > div > div > section:nth-child(${j + 1}) > div > div > a`,
          content: slide.model?.calloutButton?.href,
          attribute: "href",
          removeQueryString: true,
          removeWrapper: true,
        },
        imageUrl: {
          selector: `section:nth-child(${i}) > div > section > div > div > section:nth-child(${j + 1}) > div > picture > img`,
          content: slide.model?.image?.url,
          attribute: "src",
          removeQueryString: true,
        },
      };
      validateSelectors(main, functionName);

      // Click next button
      const nextBtn = `section:nth-child(${i}) > div > section > nav > button:nth-child(3)`;
      pagination(nextBtn, 1, "next", j, content.slides, functionName);
    });
  });
}
