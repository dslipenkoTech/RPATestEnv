import { validateSelectors } from "../functions";

export function titwSearchPageBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("(TitwSearchPageBlock)[]");
  const functionName = "titwSearchPageBlock";

  cy.visit(url).then(() => {
    const main = {
      noTermMessage: {
        selector: `main > div > div.col-span-9 > div:nth-child(3) > div > div > div`,
        content: content.noTermMessage,
      },
    };
    validateSelectors(main, functionName);

    // Bad Results
    cy.wait(2000)
      .get("main > div > div.col-span-12 > section > div > div.flex > div > input")
      .type("xxx")
      .then(() => cy.wait(2000));
    const badResults = {
      badResultsMessage: {
        selector: `main > div > div.col-span-9 > div:nth-child(3) > div > div > div`,
        content: content.badResultsMessage,
      },
    };
    validateSelectors(badResults, functionName);

    //^ Popular Search Terms
    const popularSearchTerms = {
      header: {
        selector: `main > div > div.mt-12 > div > div > h4`,
        content: content.popularSearchTerms?.header,
      },
    };
    validateSelectors(popularSearchTerms, functionName);

    content.popularSearchTerms?.terms.forEach((term: any, j: number) => {
      const termObject = {
        term: {
          selector: `main > div > div.mt-12 > div > div > div > button:nth-child(${j + 1})`,
          content: term,
        },
      };
      validateSelectors(termObject, functionName);
    });

    //^ Segment Links
    cy.get("main > div > div.col-span-12 > section > div > div.flex > div > input")
      .clear()
      .type("moody")
      .then(() => cy.wait(4000));

    content.segmentLinks?.forEach((segmentLink: any, k: number) => {
      const segmentLinks = {
        displayText: {
          selector: `main > div > div.col-span-12 > section > div > div.flex.justify-end > div > button:nth-child(${k + 1})`,
          content: segmentLink.displayText,
        },
      };
      validateSelectors(segmentLinks, functionName);
    });

    //todo - back-end bug - segment links are not showing up
    content.segments?.forEach((segment: any, l: number) => {
      const segmentObject = {
        heading: {
          selector: `main > div > div.col-span-9 > div:nth-child(3) > div:nth-child(${l + 1}) > div > div > h2`,
          content: segment.heading,
        },
      };
      //validateSelectors(segmentObject, functionName);
    });

    const searchItemOrderExtension = "div:nth-child(5)";

    cy.get(`main > div > div.col-span-12 > section > div > div.flex.justify-end > button`)
      .click()
      .then(() => {
        const buttons = {
          filterApplyFilters: {
            selector: `main > div > div.col-span-12 > div > div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border.bg-white > div.border-t-lighter-grey.fixed.bottom-0.right-0.mt-4.flex.w-full.justify-end.space-x-4.border-t.bg-white.py-4.pr-6 > button.inline-flex.items-center.justify-center.font-medium.border-solid.border.rounded-xl.cursor-pointer.transition.ease-in-out.duration-300.bg-light-blue-900.text-light-blue-50.text-base.undefined`,
            content: content.searchComponent?.filtersComponent?.filterApplyFilters, // "Apply Filters"
          },
          filterAuthorLabel: {
            selector: `main > div > div.col-span-12 > div > div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll > div:nth-child(4) > button > span > span.title.text-grey-800.text-sm.font-medium`,
            content: content.searchComponent?.filtersComponent?.filterAuthorLabel, // "Filter by Author"
            condition: content.searchComponent?.filtersComponent?.authors?.length > 0,
            fail: "skip",
          },
          filterCategoryLabel: {
            selector: `main > div > div.col-span-12 > div > div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border.bg-white > ${searchItemOrderExtension} > button > span > span.title.text-grey-800.text-sm.font-medium`,
            content: content.searchComponent?.filtersComponent?.filterCategoryLabel, // "Category"
          },
          filterClearSelection: {
            selector: `main > div > div.col-span-12 > div > div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll > div.border-t-lighter-grey.fixed.bottom-0.right-0.mt-4.flex.w-full.justify-end.space-x-4.border-t.bg-white.py-4.pr-6 > button.inline-flex.items-center.justify-center.font-medium.border-solid.border.rounded-xl.cursor-pointer.transition.ease-in-out.duration-300.bg-white.text-grey-700.border-grey-500.text-base.undefined`,
            content: content.searchComponent?.filtersComponent?.filterClearSelection, // "Clear Selection"
          },
        };
        validateSelectors(buttons, functionName);

        // Filter by author - it has more authors in the array from the api request than what's shown on the page.
        // content.searchComponent?.filtersComponent?.authors?.forEach((authorContent: any, k: number) => {
        //   const author = {
        //     name: {
        //       selector: `main > div > div.col-span-12 > div > div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border > div > div > div > div:nth-child(${
        //         k + 1
        //       }) > label`,
        //       content: authorContent,
        //     },
        //   };
        //   validateSelectors(author, functionName);
        // });

        content.searchComponent?.filtersComponent?.categories?.forEach((categoryContent: any, k: number) => {
          const category = {
            name: {
              selector: `main > div > div.col-span-12 > div > div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border.bg-white > ${searchItemOrderExtension} > div > div > div:nth-child(${
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
          `main > div > div.col-span-12 > div > div.modal-container > div > div.border-grey-200.relative.w-full.overflow-y-scroll.border.bg-white > div.text-grey-800.flex.w-full.items-center.bg-white.font-medium > span`
        ).click();
      });
  });
}
