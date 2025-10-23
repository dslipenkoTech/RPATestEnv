import { validateSelectors } from "../functions";

export function eduMediaBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduMediaBlock]()");
  const functionName = "eduMediaBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div.flex.flex-col > h2`,
        content: content.heading,
      },
      subheading: {
        selector: `section:nth-child(${i}) > div.flex.flex-col > div.subheading-class.text-sm`,
        content: content.subheading,
      },
    };
    validateSelectors(main, functionName);

    // Test video link
    content.videoLink &&
      cy.get(`section:nth-child(${i}) > div.space-y-2 > div > div > iframe`).should(($iframe) => {
        const actualHTML = $iframe[0].outerHTML.replace('allowfullscreen=""', "allowfullscreen");
        expect(actualHTML).to.equal(content.videoLink);
      });
  });
}
