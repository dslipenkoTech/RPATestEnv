import { validateSelectors } from "../functions";

export function titwStudyContentBlock(url: string, content: any, i: number) {
  cy.log("[TitwStudyContentBlock]()");
  const functionName = "titwStudyContentBlock";

  cy.visit(url).then(() => {
    //^ From The Author Section
    let fromTheAuthor = {
      authorSummary: {
        selector: `div:nth-child(${i}) > div.flex > div.mb-5 > div.space-y-1 > div.text-sm.font-normal`,
        content: content.fromTheAuthor.authorSummary,
      },
      headline: {
        selector: `div:nth-child(${i}) > div.flex > div.mb-5 > div.space-y-1 > div.text-cyan-900`,
        content: content.fromTheAuthor.headline,
      },
      smallIntro: {
        selector: `div:nth-child(${i}) > div.flex > div.mb-5 > div.space-y-1 > div.text-xs.font-medium`,
        content: content.fromTheAuthor.smallIntro,
      },
    };
    validateSelectors(fromTheAuthor, functionName);

    //^ Monthly Study Card Section
    let monthlyStudyCard = {
      author: {
        selector: `div:nth-child(${i})  > div.flex > div:nth-child(2) > a > div.w-full > div.flex > div.text-grey-800`,
        content: content.monthlyStudyCard.author,
      },
      description: {
        selector: `div:nth-child(${i})  > div.flex > div:nth-child(2) > a > div.w-full > div.mb-4 > div.text-grey-700`,
        content: content.monthlyStudyCard.description,
      },
      cardUrl: {
        selector: `div:nth-child(${i})  > div.flex > div:nth-child(2) > a`,
        content: content.monthlyStudyCard.url,
        removeQueryString: true,
      },
      title: {
        selector: `div:nth-child(${i})  > div.flex > div:nth-child(2) > a > div.w-full > div.mb-4 > div.text-cyan-900`,
        content: content.monthlyStudyCard.title,
      },
      tag: {
        selector: `div:nth-child(${i})  > div.flex > div:nth-child(2) > a > div.w-full > div.flex > div.text-light-blue-900`,
        content: content.monthlyStudyCard.tag,
      },
      imageUrl: {
        selector: `div:nth-child(${i})  > div.flex > div:nth-child(2) > a > div.aspect-video > img`,
        content: content.monthlyStudyCard.image?.url,
        attribute: "src",
        removeQueryString: true,
      },
    };
    validateSelectors(monthlyStudyCard, functionName);

    //^ Related Articles Section
    content.relatedArticles?.forEach((content: any, j: number) => {
      const relatedArticles = {
        description: {
          selector: `div:nth-child(${i}) > div.flex > div:nth-child(2) > div > a:nth-child(${j + 1}) > div.space-y-1 > div.text-grey-700`,
          content: content.description,
        },
        title: {
          selector: `div:nth-child(${i}) > div.flex > div:nth-child(2) > div > a:nth-child(${j + 1}) > div.space-y-1 > div.text-sm`,
          content: content.title,
        },
        articleUrl: {
          selector: `div:nth-child(${i}) > div.flex > div:nth-child(2) > div > a:nth-child(${j + 1})`,
          content: content.link.href,
          removeQueryString: true,
        },
        type: {
          selector: `div:nth-child(${i}) > div.flex > div:nth-child(2) > div > a:nth-child(${j + 1}) > div.text-light-blue-900`,
          content: content.type.displayName,
        },
      };
      validateSelectors(relatedArticles, functionName);
    });
  });
}
