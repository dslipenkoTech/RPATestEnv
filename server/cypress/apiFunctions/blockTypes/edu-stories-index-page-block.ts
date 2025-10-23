import { validateSelectors, formatDate } from "../functions";
import { eduUniversalStoriesBlock } from "./edu-universal-stories-block";
import { featuredMediaBlock } from "./featured-media-block";

export function eduStoriesIndexPageBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduStoriesIndexPageBlock]()");
  const functionName = "eduStoriesIndexPageBlock";

  console.log("content", content);

  cy.visit(url).then(() => {
    const main = {
      heroModelHeading: {
        selector: `div.Edu.stories-index-page > section > div > div > h1`,
        content: content.heroModel.heading,
      },
      heroModelSubheading: {
        selector: `div.Edu.stories-index-page > section > div > div > p`,
        content: content.heroModel.subheading,
      },
      heroModelTag: {
        selector: `div.Edu.stories-index-page > section > div > div > span`,
        content: content.heroModel.tag,
      },
    };
    validateSelectors(main, functionName);

    const storyHighlight = {
      authorName: {
        selector: `div:nth-child(${i}) > div > div > div > div.flex.w-full.flex-col > div.flex.flex-col.items-stretch > div > b`,
        content: content.storyHighlight.authorName,
      },
      categories: {
        selector: `div:nth-child(${i}) > div > div > div > div.flex.w-full.flex-col > div.flex.flex-col > div.text-xs.text-cyan-700`,
        content: Array.isArray(content.storyHighlight.categories)
          ? content.storyHighlight.categories.join("")
          : content.storyHighlight.categories,
      },
      date: {
        selector: `div:nth-child(${i}) > div > div > div > div.flex.w-full.flex-col > div.flex.flex-col.items-stretch > div > div`,
        content: formatDate(content.storyHighlight.date, "MMMM D, YYYY") + " " + content.storyHighlight.readingTime,
      },
      description: {
        selector: `div:nth-child(${i}) > div > div > div > div.flex.w-full.flex-col > div.flex.flex-col > div.text-grey-700.line-clamp-3.text-sm`,
        content: content.storyHighlight.description,
      },
      imageUrl: {
        selector: `div:nth-child(${i}) > div > div > div > div.aspect-video.w-full.overflow-hidden > img`,
        content: content.storyHighlight.image?.url,
        attribute: "src",
        removeQueryString: true,
      },
      linkUrl: {
        selector: `div:nth-child(${i}) > div > div > div > div.flex.w-full.flex-col > div.flex.flex-col.items-stretch > a`,
        content: content.storyHighlight.link?.href,
        removeQueryString: true,
      },
      linkText: {
        selector: `div:nth-child(${i}) > div > div > div > div.flex.w-full.flex-col > div.flex.flex-col.items-stretch > a > span.transition-spacing.mr-0.duration-300`,
        content: content.storyHighlight.link.text,
      },
      title: {
        selector: `div:nth-child(${i}) > div > div > div > div.flex.w-full.flex-col > div.flex.flex-col > h4`,
        content: content.storyHighlight.title,
      },
    };
    validateSelectors(storyHighlight, functionName);

    content.categories.forEach((category: any, y: number) => {
      const categoryObject = {
        value: {
          selector: `div.Edu.stories-index-page > div.container > div.mb-4.flex.h-full > button:nth-child(${y + 1})`,
          content: category.value,
        },
      };
      validateSelectors(categoryObject, functionName);
    });

    content.fullWidthBottomContent?.forEach((block: any, y: number) => {
      switch (block.model.contentType.slice(-1)[0]) {
        case "EduUniversalStoriesBlock":
          eduUniversalStoriesBlock(url, block.model, y, pageTypeObject, true);
          break;
        case "FeaturedMediaBlock":
          featuredMediaBlock(url, block.model, y + 1, pageTypeObject, true);
          break;
      }
    });
  });
}
