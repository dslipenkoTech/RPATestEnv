import { TableBlock, RichTextBlock, LargeCalloutBlock } from ".";
import { validateSelectors } from "../functions";

export function layoutBlock(url: string, content: any, i: number, pageTypeObject: any) {
  const isException = pageTypeObject.pageType.includes("Exception");
  isException ? cy.log("[LayoutBlockException]") : cy.log("[LayoutBlock]");
  const functionName = isException ? "layoutBlockException" : "layoutBlock";

  cy.visit(url).then(() => {
    const main = {
      headings: {
        selector: `div:nth-child(${i}).layout-block > div > div > h2`,
        content: content.heading,
      },
      subheading: {
        selector: `div:nth-child(${i}).layout-block > div > div > div`,
        content: content.subheading,
        fail: "noText",
      },
    };

    validateSelectors(main, functionName);

    content.items.forEach((item: any, j: number, k: number) => {
      let itemContentType = item.model.contentType.slice(-1)[0];
      let layoutBlockContent = item.model;

      switch (itemContentType) {
        case "TableBlock":
          TableBlock(url, layoutBlockContent, i, pageTypeObject, true, functionName, j);
          break;

        case "RichTextBlock":
          RichTextBlock(url, layoutBlockContent, i, pageTypeObject, true, functionName, j, k);
          break;

        case "LargeCalloutBlock":
          LargeCalloutBlock(url, layoutBlockContent, i, pageTypeObject, true, functionName, j);
          break;

        case "LayoutFormContainerBlock":
          console.log("TEST");
          break;

        default:
          throw new Error("ContentType " + itemContentType + " is missing in LayoutBlock");
      }
    });
  });
}
