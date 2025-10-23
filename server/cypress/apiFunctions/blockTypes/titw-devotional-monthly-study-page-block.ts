import { validateSelectors } from "../functions";

export function titwDevotionalMonthlyStudyPageBlock(url: string, content: any) {
  cy.log("[titwDevotionalMonthlyStudyPageBlock]()");
  const functionName = "titwDevotionalMonthlyStudyPageBlock";

  cy.visit(url).then(() => {
    // Hero Content
    const heroContent = {
      heroTitle: {
        selector: "#todayintheword-app > div > div > div.mb-8.mt-5 > div.px-5 > div.relative.space-y-3 > div > h1",
        content: content.heroTitle,
      },
      imageUrl: {
        selector: `#todayintheword-app > div > div > div.mb-8.mt-5.border-b > div.bg-light-blue-100.mb-4.aspect-video.flex-shrink-0 > img`,
        content: content.heroImage?.url,
        attribute: "src",
      },
      mainBody: {
        selector: `#todayintheword-app > div > div > div.px-5.lg\\:px-0 > section.mb-10.space-y-6 > section > div`,
        content: content.mainBody,
      },
      displayDate: {
        selector: `#todayintheword-app > div > div > div.mb-8.mt-5.border-b.border-slate-200.pb-8 > div.px-5 > div.mb-3.flex.justify-between > span`,
        content: content.displayDate,
      },
    };
    validateSelectors(heroContent, functionName);

    // Author Section
    const author = {
      header: {
        selector: ``,
        content: content.authors?.sectionTitle,
      },
    };
    validateSelectors(author, functionName);

    content.authors?.forEach((author: any, index: number) => {
      const authorSection = {
        title: {
          selector: `#todayintheword-app > div > div > div.px-5 > section.space-y-8 > section.space-y-5 > div.flex.flex-col.space-y-4 > div.flex.w-full.flex-col.justify-center.space-y-4 > h4`,
          content: author.title,
        },
        description: {
          selector: `#todayintheword-app > div > div > div.px-5 > section.space-y-8 > section.space-y-5 > div.flex.flex-col.space-y-4 > div.flex.w-full.flex-col.justify-center > p`,
          content: author.description,
        },
        imageUrl: {
          selector: `#todayintheword-app > div > div > div.px-5 > section.space-y-8 > section.space-y-5 > div.flex.flex-col.space-y-4 > div.author-image-wrapper.flex > img`,
          content: author.image?.url,
        },
        cardUrl: {
          selector: `#todayintheword-app > div > div > div.px-5 > section.space-y-8 > section.space-y-5 > div.flex.flex-col.space-y-4 > div.flex.w-full.flex-col.justify-center > a`,
          content: author.link?.href,
        },
      };
      validateSelectors(authorSection, functionName);
    });

    // Calendar
    const calendar = {
      header: {
        selector: `#todayintheword-app > div > div > div.px-5 > section.space-y-8 > div.space-y-5 > div.header-wrapper.relative.overflow-hidden > h2`,
        content: content.calendarSection?.heading,
      },
    };
    validateSelectors(calendar, functionName);

    // Podcast
    const podcast = {
      header: {
        selector: `#todayintheword-app > div > div > div.px-5 > section.space-y-8 > div.space-y-3 > div.header-wrapper.relative.overflow-hidden > h2`,
        content: content.podcastSection?.heading,
      },
    };
    validateSelectors(podcast, functionName);

    // Related Material
    const relatedMaterial = {
      header: {
        selector: `#todayintheword-app > div > div > div.px-5 > section.space-y-8 > section.space-y-6 > div.header-wrapper.relative.overflow-hidden > h2`,
        content: content.relatedMaterials?.heading,
      },
    };
    validateSelectors(relatedMaterial, functionName);

    // Related Material > Cards
    content.relatedMaterials?.cards?.forEach((card: any, index: number) => {
      const relatedMaterialCard = {
        title: {
          selector: `section.space-y-6 > div:nth-child(2) > div > a:nth-child(${
            index + 1
          }) > div.flex.h-full.w-full.flex-col > div:nth-child(1) > div:nth-child(1) > span`,
          content: card.title,
        },
        description: {
          selector: `section.space-y-6 > div:nth-child(2) > div > a:nth-child(${
            index + 1
          }) > div.flex.h-full.w-full.flex-col.justify-between.space-y-2.p-2 > div:nth-child(1) > div.text-grey-700.mt-2.line-clamp-4.text-sm.font-normal`,
          content: card.description,
        },
        imageUrl: {
          selector: `section.space-y-6 > div:nth-child(2) > div > a:nth-child(${index + 1}) > div > img`,
          content: card.image?.url,
          removeQueryString: true,
          removeWrapper: true,
          attribute: "src",
        },
        authorName: {
          selector: `section.space-y-6 > div:nth-child(2) > div > a:nth-child(${
            index + 1
          }) > div.flex.h-full.w-full > div.flex.items-center.justify-between > div:nth-child(1) > span`,
          content: card.authorName,
        },
        cardUrl: {
          selector: `section.space-y-6 > div:nth-child(2) > div > a:nth-child(${index + 1})`,
          content: card.link?.href,
        },
        type: {
          selector: `section.space-y-6 > div:nth-child(2) > div > a:nth-child(${
            index + 1
          }) > div.flex.h-full.w-full.flex-col > div.flex.items-center > div:nth-child(2) > span`,
          content: card.type?.displayName,
        },
      };
      validateSelectors(relatedMaterialCard, functionName);
    });
  });
}
