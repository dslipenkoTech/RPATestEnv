import { validateSelectors, formatDate } from "../functions";

export function recentNewsBlock(url: string, content: any, i: number) {
  cy.log("[RecentNewsBlock]()");
  const functionName = "recentNewsBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div > div > div.flex> h2`,
        content: content.heading,
      },
      featuredArticleTitle: {
        selector: `section:nth-child(${i}) > div > div > div.flex > a > div > div > div.mb-2`,
        content: content.featuredArticle.title,
      },
      featuredArticleDescription: {
        selector: `section:nth-child(${i}) > div > div > div.flex > a > div > div > div.text-light-blue-100`,
        content: content.featuredArticle.description,
      },
      // Skip validation when image is absent since it's an inline style attribute, not a CSS class
      featuredArticleImageUrl: {
        selector: `section:nth-child(${i}) > div > div > div.flex > a > div`,
        content: content.featuredArticle.image?.url,
        attribute: "style",
        function: "include",
        fail: "skip",
      },
      featuredArticleUrl: {
        selector: `section:nth-child(${i}) > div > div > div.flex.md\\:w-3\\/5 > a`,
        content: content.featuredArticle.link.href,
      },
      viewAllButton: {
        selector: `section:nth-child(${i}) > div > div > div.flex.md\\:w-2\\/5 > div.order-5 > a`,
        content: content.viewAllLink?.text,
      },
      viewAllButtonUrl: {
        selector: `section:nth-child(${i}) > div > div > div.flex.md\\:w-2\\/5 > div.order-5 > a`,
        content: content.viewAllLink?.href,
      },
    };
    validateSelectors(main, functionName);

    content.articles.forEach((article: any, j: number) => {
      const articleEl = {
        title: {
          selector: `section:nth-child(${i}) > div > div > div.flex > div.flex-col > div:nth-child(${
            j + 1
          }) > a > div > div.flex > div.line-clamp-2`,
          content: article.title,
        },
        date: {
          selector: `section:nth-child(${i}) > div > div > div.flex > div.flex-col > div:nth-child(${
            j + 1
          }) > a > div > div.flex > div.text-grey-500`,
          content: formatDate(article.date, "M/D/YYYY"),
        },
        articleUrl: {
          selector: `section:nth-child(${i}) > div > div > div.flex > div.flex-col > div:nth-child(${j + 1}) > a`,
          content: article.link.href,
        },
        imageUrl: {
          selector: `section:nth-child(${i}) > div > div > div.flex > div.flex > div:nth-child(${j + 1}) > a > div > div.mb-4 > img`,
          content: article.image?.url,
          attribute: "src",
          removeQueryString: true,
        },
      };
      validateSelectors(articleEl, functionName);
    });
  });
}
