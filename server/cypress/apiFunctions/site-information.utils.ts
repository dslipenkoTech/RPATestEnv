// Suppresses console output from external sources during testing
export function hideConsoleLogs() {
  Cypress.on("window:before:load", (win) => {
    win.console.log = () => {};
    win.console.warn = () => {};
    win.console.error = () => {};
  });
}

// Formats and displays site information with proper styling
export function displayFormattedMessage(siteInformation: any, status: number) {
  const testExceptionLine = siteInformation.testException ? `\n      testException: ${stringify(siteInformation.testException)},` : "";

  const message = `
      id: ${siteInformation.id},
      status: ${siteInformation.status},
      name: ${siteInformation.name},
      url: ${siteInformation.url},
      contentType: ${siteInformation.contentType},
      block count: ${siteInformation.blockCount},${testExceptionLine}
      types: ${stringify(siteInformation.types)}
  `;

  const logMethod = status === 200 ? console.log : console.error;
  logMethod(message);
}

// Extracts block types
export function extractBlockTypes(blocks: any[]) {
  return blocks.map((block: any) => {
    const blockType = block.contentType.slice(-1)[0];

    // Handle layout blocks with nested items
    if (blockType.includes("LayoutBlock")) {
      const items = block.items.map((item: any) => item.model?.contentType.slice(-1)[0]).join(", ");
      return `LayoutBlock: ${items}`;
    }

    // Handle tab hero slider blocks with nested content
    if (blockType.includes("TitwTabHeroSliderBlock")) {
      const items = block.tabs.flatMap((tab: any) => tab.content.map((content: any) => content.model?.contentType.slice(-1)[0])).join(", ");
      return `TitwTabHeroSliderBlock: ${items}`;
    }

    return blockType;
  });
}

// Formats objects for console display with proper indentation
function stringify(results: any) {
  const indent = "        ";
  return JSON.stringify(results, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : indent + line))
    .join("\n");
}
