import { validateSelectors, formatDate } from "../functions";

export function eduStoriesFeatureBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduStoriesFeatureBlock]()");
  const functionName = "eduStoriesFeatureBlock";

  cy.visit(url).then(() => {
    const main = {
      headline: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.flex.w-full.flex-col > div > h2`,
        content: content.headline,
      },
      description: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.flex.w-full.flex-col > div > div`,
        content: content.description,
      },
      allStoriesLinkText: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.mb-6.flex.flex-col > a`,
        content: content.allStoriesLink?.text,
      },
      allStoriesLinkUrl: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.mb-6.flex.flex-col > a`,
        content: content.allStoriesLink?.href,
        removeQueryString: true,
      },
    };

    validateSelectors(main, functionName);

    const featuredStory = {
      title: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.group.flex.w-full > a > div > div.flex.flex-col > div.font-georgia.mb-0.line-clamp-2`,
        content: content.featuredStory?.title,
      },
      description: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.group.flex.w-full > a > div > div.flex.flex-col > div.mt-2.transition-all.duration-500 > div.text-grey-700`,
        content: content.featuredStory?.description,
      },
      date: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.group.flex.w-full > a > div > div.flex.flex-col.justify-end > div.text-grey-500.mb-2`,
        content:
          content.featuredStory?.categories.length > 0
            ? `${formatDate(content.featuredStory?.date, "MMMM D, YYYY")} ${content.featuredStory?.categories.join("")}`
            : formatDate(content.featuredStory?.date, "MMMM D, YYYY"),
      },
      imgUrl: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.group.flex.w-full > a > div > div.mb-0.block.aspect-video.w-full.max-w-full.overflow-hidden.rounded-sm > img`,
        content: content.featuredStory?.image?.url,
        removeQueryString: true,
        attribute: "src",
      },
      linkText: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.flex.flex-col.group > a > div > div.flex.flex-col.justify-end > div.mt-2.transition-all.overflow-hidden > div.flex.text-sm.mt-4 > span.mr-0.transition-spacing`,
        content: content.featuredStory?.link?.text,
      },
      linkUrl: {
        selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.group.flex.w-full > a`,
        content: content.featuredStory?.link?.href,
        removeQueryString: true,
      },
    };

    validateSelectors(featuredStory, functionName);

    for (let j = 0, y = 1; j < content.stories.length; j++, y += 2) {
      const story = content.stories[j];
      const storyObject = {
        title: {
          selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.flex.w-full.flex-col > div > a:nth-child(${y}) > div > div.flex.flex-col > div.line-clamp-2.text-base.duration-300`,
          content: story.title,
        },
        date: {
          selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.flex.w-full.flex-col > div > a:nth-child(${y}) > div > div.flex.flex-col > div.text-grey-500.mb-2.flex`,
          content:
            story.categories.length > 0
              ? `${formatDate(story.date, "MMMM D, YYYY")} ${story.categories.join("")}`
              : formatDate(story.date, "MMMM D, YYYY"),
        },
        imageUrl: {
          selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.flex.w-full.flex-col > div > a:nth-child(${y}) > div > div.mb-0.mr-4.overflow-hidden > img`,
          content: story.image?.url,
          removeQueryString: true,
          attribute: "src",
        },
        linkUrl: {
          selector: `section:nth-child(${i}) > div > div > div.flex.flex-col > div.flex.w-full.flex-col > div > a:nth-child(${y})`,
          content: story.link?.href,
          removeQueryString: true,
        },
      };

      validateSelectors(storyObject, functionName);
    }
  });
}
