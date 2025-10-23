import { validateSelectors, getVariableFromUrl } from "../functions";

export function richTextBlock(
  url: string,
  content: any,
  i = 0,
  pageTypeObject: any,
  skipVisit = false,
  parentFunction: any,
  j: number,
  k: number
) {
  const isException = pageTypeObject.pageType.includes("Exception");
  isException ? cy.log("[RichTextBlockException]") : cy.log("[RichTextBlock]");
  const functionName = isException ? "richTextBlockException" : "richTextBlock";

  if (!skipVisit) cy.visit(url);
  cy.then(() => {
    getVariableFromUrl().then((env) => {
      const selector = {
        layoutBlock:
          env === "Edu"
            ? `div:nth-child(${i}) > div > section:nth-child(${j + 1}) > div`
            : `div > main > div:nth-child(${i}) > div > section:nth-child(${j + 1})`,
        titwTabHeroSliderBlock: `section.TITW.tab-hero-slider > div > div > div:nth-child(3) > div:nth-child(${
          j + 1
        }) > div > section:nth-child(${k + 1})`,
      };
      let main;
      if (isException) {
        main = {
          rickTextField: {
            selector: `#top-wrapper > div > main > div:nth-child(3) div > div > section:nth-child(${j + 1}) > div`,
            content: content.richTextField,
            fail: "notVisible",
          },
        };
      } else {
        main = {
          rickTextField: {
            selector: parentFunction
              ? selector[parentFunction as keyof typeof selector]
              : `div.container > div > main > section:nth-child(${i}) > div`,
            content: content.richTextField,
            fail: "notVisible",
          },
        };
      }
      validateSelectors(main, functionName);
    });
  });
}
