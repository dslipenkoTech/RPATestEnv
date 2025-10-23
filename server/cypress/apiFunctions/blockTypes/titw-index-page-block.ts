import { validateSelectors } from "../functions";

export function titwIndexPageBlock(url: string, content: any, i: number, pageTypeObject: any) {
  const functionName = "titwIndexPageBlock";
  cy.log("[titwIndexPageBlock]()");

  cy.visit(url).then(() => {
    const extension = content.headerComponent || content.header;
    const discussionStarterIndexPage =
      pageTypeObject.pageType === "DiscussionStarterIndexPage" ? "div:nth-child(1) > div" : "div.flex.w-full";

    const headerComponent = {
      title: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > ${discussionStarterIndexPage} > div.mb-3.space-y-1 > h3`,
        content: extension?.title,
      },
      description: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > ${discussionStarterIndexPage} > div.mb-3.space-y-1 > div`,
        content: extension?.description,
      },
      imageUrl: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > div > img`,
        content: extension?.image?.url,
        attribute: "src",
        fail: "skip",
      },
      date: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > ${discussionStarterIndexPage} > div.row > div.flex`,
        content: extension?.date,
      },
      tag: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > ${discussionStarterIndexPage} > div.row > div.bg-light-blue-100`,
        content: extension?.tag,
      },
      devotionalDetailLinkText: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > ${discussionStarterIndexPage} > div.flex > a.bg-cyan-600`,
        content: extension?.devotionalDetailLink?.text,
      },
      devotionalDetailLinkUrl: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > ${discussionStarterIndexPage} > div.flex > a.bg-cyan-600`,
        content: extension?.devotionalDetailLink?.href,
        removeQueryString: true,
      },
      monthlyStudyLinkText: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > ${discussionStarterIndexPage} > div.flex > a.bg-light-blue-900`,
        content: extension?.monthlyStudyLink?.text || extension?.link?.text || extension?.viewMaterialsLink?.text,
      },
      monthlyStudyLinkUrl: {
        selector: `#todayintheword-app > div > div > div.mb-6 > div > ${discussionStarterIndexPage} > div.flex > a.bg-light-blue-900`,
        content: extension?.monthlyStudyLink?.href || extension?.link?.href || extension?.viewMaterialsLink?.href,
        removeQueryString: true,
      },
    };
    validateSelectors(headerComponent, functionName);

    const searchExtension = content.searchComponent || content.search;
    const bibleVerseIndexPage = pageTypeObject.pageType === "TitwBibleVerseIndexPage" ? "" : "div > ";

    //^ Search Component
    const searchComponent = {
      searchButtonText: {
        selector: `#todayintheword-app > div > div > ${bibleVerseIndexPage} section > div > div.flex > button`,
        content: searchExtension?.searchButtonText, // "Search"
      },
      filtersButtonText: {
        selector: `#todayintheword-app > div > div > ${bibleVerseIndexPage} section > div > div.flex > button > span`,
        content: searchExtension?.filtersButtonText, // "Filter"
      },
    };
    validateSelectors(searchComponent, functionName);

    //^ Content Types
    searchExtension?.contentTypes?.forEach((contentType: any, j: number) => {
      const contentTypeComponent = {
        displayText: {
          selector: `#todayintheword-app > div > div > ${bibleVerseIndexPage} section > div > div.flex > div > button:nth-child(${j + 1})`,
          content: contentType.displayText, // "All"
          attribute: "text",
        },
      };
      validateSelectors(contentTypeComponent, functionName);
    });

    //
    cy.get(`#todayintheword-app > div > div > ${bibleVerseIndexPage} section > div > div.flex.justify-end > button`)
      .click()
      .then(() => {
        const searchItemOrderExtension = searchExtension?.filtersComponent?.authors?.length > 0 ? "div:nth-child(5)" : "div";
        const buttons = {
          filterApplyFilters: {
            selector: `#todayintheword-app > div > div > div > ${bibleVerseIndexPage} div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border.bg-white > div.border-t-lighter-grey.fixed.bottom-0.right-0.mt-4.flex.w-full.justify-end.space-x-4.border-t.bg-white.py-4.pr-6 > button.inline-flex.items-center.justify-center.font-medium.border-solid.border.rounded-xl.cursor-pointer.transition.ease-in-out.duration-300.bg-light-blue-900.text-light-blue-50.border-light-blue-900.hover\\:bg-light-blue-700.hover\\:border-light-blue-700.active\\:bg-light-blue-700.active\\:border-light-blue-700.disabled\\:bg-grey-300.disabled\\:text-grey-400.disabled\\:border-grey-300.disabled\\:cursor-not-allowed.py-2.text-base.undefined`,
            content: searchExtension?.filtersComponent?.filterApplyFilters, // "Apply Filters"
          },
          filterAuthorLabel: {
            selector: `#todayintheword-app > div > div > div > ${bibleVerseIndexPage} div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll > div:nth-child(4) > button > span > span.title.text-grey-800.text-sm.font-medium`,
            content: searchExtension?.filtersComponent?.filterAuthorLabel, // "Filter by Author"
            condition: searchExtension?.filtersComponent?.authors?.length > 0,
            fail: "skip",
          },
          filterCategoryLabel: {
            selector: `#todayintheword-app > div > div > div > ${bibleVerseIndexPage} div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border.bg-white > ${searchItemOrderExtension} > button > span > span.title.text-grey-800.text-sm.font-medium`,
            content: searchExtension?.filtersComponent?.filterCategoryLabel, // "Category"
          },
          filterClearSelection: {
            selector: `#todayintheword-app > div > div > div > ${bibleVerseIndexPage} div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll > div.border-t-lighter-grey.fixed.bottom-0.right-0.mt-4.flex.w-full.justify-end.space-x-4.border-t.bg-white.py-4.pr-6 > button.inline-flex.items-center.justify-center.font-medium.border-solid.border.rounded-xl.cursor-pointer.transition.ease-in-out.duration-300.bg-white.text-grey-700.border-grey-500.text-base.undefined`,
            content: searchExtension?.filtersComponent?.filterClearSelection, // "Clear Selection"
          },
        };
        validateSelectors(buttons, functionName);

        // Only check the last 2 authors if they exist
        if (searchExtension?.filtersComponent?.authors?.length > 0) {
          const lastTwoAuthors = searchExtension.filtersComponent.authors.slice(-2);
          lastTwoAuthors.forEach((authorContent: any, k: number) => {
            const author = {
              name: {
                selector: `#todayintheword-app > div > div > div > ${bibleVerseIndexPage} div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border > div > div > div > div:nth-child(${
                  k + 1
                }) > label`,
                content: authorContent,
              },
            };
            validateSelectors(author, functionName);
          });
        }

        searchExtension?.filtersComponent?.categories?.forEach((categoryContent: any, k: number) => {
          const category = {
            name: {
              selector: `#todayintheword-app > div > div > div > ${bibleVerseIndexPage} div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border.bg-white > ${searchItemOrderExtension} > div > div > div:nth-child(${
                k + 1
              }) > label`,
              content: categoryContent.name,
            },
          };
          validateSelectors(category, functionName);
        });
      })
      .then(() => {
        cy.get(
          `#todayintheword-app > div > div > div > ${bibleVerseIndexPage} div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border.bg-white > div.text-grey-800.flex.w-full.items-center.bg-white.font-medium > span`
        ).click();
      });
  });
}
