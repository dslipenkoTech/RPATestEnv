import { validateSelectors, frontEndBtnUrlTest, formatDate } from "../functions";

export function titwHomeHeroBlock(url: string, content: any) {
  cy.log("[TitwHomeHeroBlock]()");
  const functionName = "titwHomeHeroBlock";

  cy.visit(url).then(() => {
    const bannerElements = {
      title: {
        selector: `div.container > div > div > div.mb-4 > div.text-2xl`,
        content: content.title,
      },
      bannerImageUrl: {
        selector: `div.container > div > picture > img`,
        content: content.bannerImage?.url,
        attribute: "src",
        removeQueryString: true,
      },
      teaserText: {
        selector: `div.container > div > div > div.text-grey-700`,
        content: content.teaserText,
      },
      issueDate: {
        selector: content.bibleReference
          ? `div.container > div > div > div.mb-4 > div > span:nth-child(3)`
          : `div.container > div > div > div.mb-4 > div > span.text-grey-600`,
        content: content.issueDate && formatDate(content.issueDate, "dddd, MMMM D, YYYY"),
      },
      tag: {
        selector: `div.container > div > div > div.mb-2\\.5 > div`,
        content: content.tag,
      },
      button: {
        selector: `div.container.mt-3.w-full > div > div > a`,
        content: content.link?.title,
      },
    };
    validateSelectors(bannerElements, functionName);

    content.link && frontEndBtnUrlTest(bannerElements.button.selector, content.link.href, functionName);
  });
}
