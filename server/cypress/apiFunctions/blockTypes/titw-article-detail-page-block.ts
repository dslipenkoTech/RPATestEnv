import { validateSelectors } from "../functions";

export function titwArticleDetailPageBlock(url: string, content: any, i: number, pageTypeObject: any) {
  const functionName = "titwArticleDetailPageBlock";
  cy.log("[titwArticleDetailPageBlock]()");

  cy.visit(url).then(() => {
    // Hero section
    const heroSection = {
      featuredImageUrl: {
        selector: "#todayintheword-app > div > div > div.border-b.border-slate-200 > div.mb-4.aspect-video > img",
        content: content.featuredImage.url,
        attribute: "src",
      },
      title: {
        selector: "h1",
        content: content.title,
      },
      subtitle: {
        selector: "#todayintheword-app > div > div > div.border-b.border-slate-200 > div.flex.flex-col.space-y-1 > p",
        content: content.subtitle,
      },
      displayDate: {
        selector: "#todayintheword-app > div > div > div.border-b.border-slate-200.pb-8 > div.mb-3.flex.justify-between > span",
        content: content.displayDate,
      },
    };
    validateSelectors(heroSection, functionName);

    // Body section
    const mainBody = {
      item: {
        selector: "#todayintheword-app > div > div > div.space-y-6.lg\\:space-y-10 > section > div > div",
        content: content.mainBody?.items[0]?.html,
      },
      imageBanner: {
        selector: "#todayintheword-app > div > div > div.space-y-6 > section > div > div.epi-contentfragment > section > div > div",
        content: content.mainBody?.items[1]?.model?.richTextField,
      },
    };
    validateSelectors(mainBody, functionName);
  });
}
