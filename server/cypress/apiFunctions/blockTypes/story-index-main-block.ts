import { validateSelectors, pagination } from "../functions";

export function storyIndexMainPageBlock(url: string, content: any, i: number) {
  cy.log("[StoryIndexMainPageBlock]()");
  const functionName = "storyIndexMainPageBlock";

  cy.visit(url).then(() => {
    const hero = {
      heading: {
        selector: `section.hero > div > div > div > h1`,
        content: content.hero.heading,
      },
      imageUrl: {
        selector: `section.hero > picture > img`,
        content: content.hero.image?.url,
        removeQueryString: true,
        attribute: "src",
      },
    };
    validateSelectors(hero, functionName);

    const storiesByMinistry = {
      heading: {
        selector: `div > main > div > div.mb-6.md\\:mb-4.md\\:grid.md\\:grid-cols-12 > div > h2`,
        content: content.storiesByMinistry?.heading,
      },
    };
    validateSelectors(storiesByMinistry, functionName);

    content.storiesByMinistry?.items?.forEach((item: any, z: number) => {
      const story = {
        title: {
          selector: `div > main > div > div.grid.grid-cols-1.gap-4.md\\:grid-cols-2.md\\:gap-8 > div:nth-child(${
            z + 1
          }) > section > a > div > div > h2`,
          content: item.title,
        },
        description: {
          selector: `div > main > div > div.grid.grid-cols-1.gap-4.md\\:grid-cols-2.md\\:gap-8 > div:nth-child(${
            z + 1
          }) > section > a > div > div > p`,
          content: item.description,
          fail: "noText",
        },
        imageUrl: {
          selector: `div > main > div > div.grid.grid-cols-1.gap-4.md\\:grid-cols-2.md\\:gap-8 > div:nth-child(${
            z + 1
          }) > section > a > picture > img`,
          content: item.image?.url,
          removeQueryString: true,
          attribute: "src",
        },
        linkUrl: {
          selector: `div > main > div > div.grid.grid-cols-1.gap-4.md\\:grid-cols-2.md\\:gap-8 > div:nth-child(${z + 1}) > section > a`,
          content: item.link?.href,
          removeQueryString: true,
        },
      };
      validateSelectors(story, functionName);
    });

    const featuredStories = {
      heading: {
        selector: `section:nth-child(2) > div > div.mb-6 > div > h2`,
        content: content.featuredStories?.heading,
      },
    };
    validateSelectors(featuredStories, functionName);

    content.featuredStories.items?.forEach((item: any, z: number) => {
      pagination(
        `section:nth-child(2) > div > div.flex.flex-wrap.justify-center.md\\:justify-start > section > nav > button:nth-child(3)`,
        4,
        "Featured Stories",
        z,
        content.featuredStories?.items,
        functionName
      );

      const featured = {
        title: {
          selector: `section:nth-child(2) > div > div.flex.flex-wrap.justify-center.md\\:justify-start > section > div > div > div:nth-child(${
            z + 1
          }) > a > div > div > div.line-clamp-2`,
          content: item.title,
        },
        description: {
          selector: `section:nth-child(2) > div > div.flex.flex-wrap > section > div > div > div:nth-child(${
            z + 1
          }) > a > div > div > div.line-clamp-4`,
          content: item.description,
          fail: "noText",
        },
        imageUrl: {
          selector: `section:nth-child(2) > div > div.flex.flex-wrap.justify-center.md\\:justify-start > section > div > div > div:nth-child(${
            z + 1
          }) > a > img`,
          content: item.image?.url,
          removeQueryString: true,
          attribute: "src",
        },
        linkUrl: {
          selector: `section:nth-child(2) > div > div.flex.flex-wrap > section > div > div > div:nth-child(${z + 1}) > a`,
          content: item.link?.href,
          removeQueryString: true,
        },
      };
      validateSelectors(featured, functionName);
    });
  });
}
