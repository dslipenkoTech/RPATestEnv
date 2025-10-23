import { sideMenu } from "./general-detail-page-el";
import { validateSelectors } from "../functions";

export function titwGeneralDetailPageBlock(url: string, content: any, i: number) {
  cy.log("[TitwGeneralDetailPageBlock]()");
  const functionName = "titwGeneralDetailPageBlock";

  cy.visit(url).then(() => {
    const main = {
      title: {
        selector: `section > div > div.order-5 > h1`,
        content: content.title,
      },
      summary: {
        selector: `section > div > div.order-5 > p`,
        content: content.summary,
      },
      heroImageUrl: {
        selector: `section > div > div.order-0 > div > picture > img`,
        content: content.heroImage?.url,
        attribute: "src",
        removeQueryString: true,
      },
      mainBodyMarkup: {
        selector: `div.container > div > main > section > div > section > div`,
        content: content.mainBodyMarkup,
      },
    };
    validateSelectors(main, functionName);

    sideMenu(content, i);
  });
}
