import { getVariableFromUrl, validateSelectors } from "../functions";

export function tableBlock(url: string, content: any, i = 0, pageTypeObject: any, skipVisit = false, parentFunction: any, j: number) {
  cy.log("[TableBlock]()");
  const functionName = "tableBlock";

  if (!skipVisit) cy.visit(url);
  cy.then(() => {
    getVariableFromUrl().then((env) => {
      const selectors = {
        layoutBlock: {
          heading:
            env === "Edu"
              ? `div:nth-child(${i}) > div > div:nth-child(${j + 1}) > section > div.flex > h2`
              : env === "MBI"
              ? `div.MBI.layout-block.container > div.grid.grid-cols-12 > div > section > div.header-wrapper > h2`
              : `div.grid.grid-cols-12.gap-x-4.gap-y-8.md\\:gap-x-8 > div > section > div.header-wrapper > h2`,
          subheading:
            env === "Edu"
              ? `div:nth-child(${i}) > div > div:nth-child(${j + 1}) > section > div.flex > div`
              : env === "MBI"
              ? `div.MBI.layout-block.container > div.grid.grid-cols-12 > div > section > div.header-wrapper > div`
              : `div.grid.grid-cols-12.gap-x-4.gap-y-8.md\\:gap-x-8 > div > section > div.header-wrapper > div`,
          tableField:
            env === "Edu"
              ? `div:nth-child(${i}) > div > div:nth-child(${j + 1}) > section > div.prose-sm > table`
              : env === "MBI"
              ? `div.MBI.layout-block.container > div.grid.grid-cols-12 > div > section > div.prose-sm > table`
              : `div.grid.grid-cols-12.gap-x-4.gap-y-8.md\\:gap-x-8 > div > section > div.prose-sm > table`,
        },
      };

      const main = {
        heading: {
          // Temp: added an extra s to the displayWidths to see in which cases the selector should be applied.
          selector: content.displayWidthss
            ? `div:nth-child(2) > div.container.mx-auto > div > main > div:nth-child(${i}) > div > div:nth-child(${
                j + 1
              }) > section > div.flex.flex-col > h2`
            : parentFunction
            ? selectors[parentFunction as keyof typeof selectors].heading
            : `div.container > div > main > div:nth-child(${i}) > section > div.header-wrapper > h2`,
          content: content.heading,
        },
        subheading: {
          selector: content.displayWidthss
            ? `div:nth-child(2) > div.container.mx-auto > div > main > div:nth-child(${i}) > div > div:nth-child(${
                j + 1
              }) > section > div.flex.flex-col.space-y-2 > div.subheading-class.text-sm.md\\:text-base`
            : parentFunction
            ? selectors[parentFunction as keyof typeof selectors].subheading
            : `div.container > div > main > div:nth-child(${i}) > section > div.header-wrapper > div`,
          content: content.subheading,
        },
        tableField: {
          selector: content.displayWidthss
            ? `div:nth-child(2) > div.container.mx-auto > div > main > div:nth-child(${i}) > div > div:nth-child(${
                j + 1
              }) > section > div.prose-sm.prose-headings\\:text-grey-700.prose-table\\:rounded-sm.prose-table\\:border-grey-100.prose-table\\:\\!border-separate.prose-table\\:\\!border-spacing-0.w-full.\\!max-w-none.overflow-auto > table`
            : parentFunction
            ? selectors[parentFunction as keyof typeof selectors].tableField
            : `div.container > div > main > div:nth-child(${i}) > section > div.prose-sm`,
          content: content.tableField,
        },
      };
      validateSelectors(main, functionName);
    });
  });
}
