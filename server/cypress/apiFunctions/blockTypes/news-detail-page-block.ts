import { validateSelectors, formatDate, currentUrlTest } from "../functions";

export function newsDetailPageBlock(url: string, content: any) {
  cy.log("[NewsDetailPageBlock]()");
  const functionName = "newsDetailPageBlock";

  cy.visit(url).then(() => {
    const main = {
      title: {
        selector: `div.container > div > div > h1`,
        content: content.title,
      },
      date: {
        selector: `div.container > div > div.col-span-12 > div.flex > div`,
        content: formatDate(content.date, "DD MMMM, YYYY"),
      },
      mainBody: {
        selector: `div.container > div > div.col-span-12 > div:nth-child(5) > section > div`,
        content: content.mainBody,
      },
      featuredImageUrl: {
        selector: `div.container > div > div.col-span-12 > div:nth-child(4) > img`,
        content: content.featuredImage?.url,
        attribute: `src`,
        removeQueryString: true,
      },
    };
    validateSelectors(main, functionName);

    // Test pageUrl
    currentUrlTest(content.pageUrl);

    //^ Related Articles
    content.relatedArticles.forEach((article: any) => {
      const relatedArticles = {
        title: {
          selector: `div.container > div > div.lg\\:col-span-3 > a > span`,
          content: article.title,
        },
        description: {
          selector: `div.container > div > div > a > div.line-clamp-3.text-sm`,
          content: article.description,
        },
        date: {
          selector: `div.container > div > div > a > div.flex > div.text-grey-700`,
          content: formatDate(article.date as string, "M/D/YYYY"),
        },
        ministryTag: {
          selector: `div.container > div > div > a > div.flex > div.ml-6 > div`,
          content: article.ministryTag?.displayName,
        },
        cardUrl: {
          selector: `div.container > div > div > a`,
          content: article.link.href,
        },
      };
      validateSelectors(relatedArticles, functionName);
    });

    //
  });
}
