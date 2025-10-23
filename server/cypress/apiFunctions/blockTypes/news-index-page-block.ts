import { validateSelectors, formatDate, currentUrlTest } from "../functions";

export function newsIndexPageBlock(url: string, content: any) {
  cy.log("[NewsIndexPageBlock]()");
  const functionName = "newsIndexPageBlock";

  cy.visit(url).then(() => {
    const main = {
      title: {
        selector: `h1`,
        content: content.title,
      },
    };
    validateSelectors(main, functionName);

    // Test pageUrl
    currentUrlTest(content.pageUrl);

    //^ Filter Menu
    const filterMenu = {
      heading: {
        selector: `main > div > div > div.md\\:w-1\\/3 > div > h2`,
        content: content.filterMenu?.heading,
        fail: "noText",
      },
    };
    validateSelectors(filterMenu, functionName);

    // Filter menu items
    content.filterMenu?.items?.forEach((item: any, j: number) => {
      const filterItem = {
        text: {
          selector: `main > div > div > div.md\\:w-1\\/3 > div > ul > li:nth-child(${j + 1}) > a`,
          content: item.text,
        },
        itemUrl: {
          selector: `main > div > div > div.md\\:w-1\\/3 > div > ul > li:nth-child(${j + 1}) > a`,
          content: item.href,
        },
      };
      validateSelectors(filterItem, functionName);
    });

    //^ Featured Article
    const featuredArticle = {
      featuredArticleHeader: {
        selector: `main > div > div > div.w-full > div:nth-child(1) > h2`,
        content: content.featuredArticleHeader,
      },
      title: {
        selector: `main > div > div > div.w-full > div:nth-child(1) > div > div.card-bottom > a:nth-child(2) > div`,
        content: content.featuredArticle?.title,
      },
      description: {
        selector: `main > div > div > div.w-full > div:nth-child(1) > div > div.card-bottom > p`,
        content: content.featuredArticle?.description,
      },
      date: {
        selector: `main > div > div > div.w-full > div:nth-child(1) > div > div.card-bottom > div.mb-2`,
        content: formatDate(content.featuredArticle?.date as string, "M/D/YYYY"),
      },
      articleUrl: {
        selector: `main > div > div > div.w-full > div:nth-child(1) > div > div.card-bottom > a:nth-child(2)`,
        content: content.featuredArticle?.link?.href,
      },
      imageUrl: {
        selector: `main > div > div > div.w-full > div:nth-child(1) > div > div.mb-4 > img`,
        content: content.featuredArticle?.image?.url,
        attribute: "src",
        removeQueryString: true,
      },
      ministryTag: {
        selector: `main > div > div > div.w-full > div:nth-child(1) > div > div.card-bottom > div.mb-4 > div`,
        content: content.featuredArticle?.ministryTag?.displayName,
      },
    };
    validateSelectors(featuredArticle, functionName);

    //^ Articles
    content.articles?.months?.forEach((articleContent: any, k: number) => {
      const heading = {
        name: {
          selector: `#article_list > ul > li:nth-child(${k + 1}) > div > h2`,
          content: articleContent.name,
        },
      };
      validateSelectors(heading, functionName);

      articleContent.items.forEach((item: any, l: number) => {
        const articles = {
          title: {
            selector: `#article_list > ul > li:nth-child(${k + 1}) > ul > li:nth-child(${
              l + 1
            }) > div > div.card-bottom > a:nth-child(2) > div`,
            content: item.title,
          },
          description: {
            selector: `#article_list > ul > li:nth-child(${k + 1}) > ul > li:nth-child(${l + 1}) > div > div.card-bottom > p`,
            content: item.description,
          },
          itemUrl: {
            selector: `#article_list > ul > li:nth-child(${k + 1}) > ul > li:nth-child(${l + 1}) > div > div.card-bottom > a:nth-child(2)`,
            content: item.link?.href,
          },
          date: {
            selector: `#article_list > ul > li:nth-child(${k + 1}) > ul > li:nth-child(${l + 1}) > div > div.card-bottom > div.mb-2`,
            content: formatDate(item.date as string, "M/D/YYYY"),
          },
          imageUrl: {
            selector: `#article_list > ul > li:nth-child(${k + 1}) > ul > li:nth-child(${l + 1}) > div > div.mb-4 > img`,
            content: item.image?.url,
            attribute: "src",
            removeQueryString: true,
          },
          ministryTag: {
            selector: `#article_list > ul > li:nth-child(${k + 1}) > ul > li:nth-child(${l + 1}) > div > div.card-bottom > div.mb-4 > div`,
            content: item.ministryTag?.displayName,
          },
        };
        validateSelectors(articles, functionName);
      });
    });
  });
}
