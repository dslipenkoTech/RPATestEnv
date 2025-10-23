import { hideConsoleLogs, displayFormattedMessage, extractBlockTypes } from "./site-information.utils";
import { apiRequest, pageStatus } from "./page-api";
import { organizePageBlocks } from "./blockTesting/block-testing";

// Fetch and display information for multiple pages
export function getWebInfo(tests: any[]) {
  console.clear();

  tests.forEach((test) => {
    // Extract page ID from test
    const pageId = Array.isArray(test) ? test[0] : test;
    fetchAndLogPageInfo(pageId);
  });
}

// Fetches page content from API and validates page status before logging
function fetchAndLogPageInfo(pageId: number) {
  return apiRequest(pageId, true).then((content: any) => {
    Cypress.env("savedContent", content);
    return pageStatus(content).then((status: number) => logPageInformation(content, status));
  });
}

// Processes page content and displays formatted information to console
function logPageInformation(content: any, status: number) {
  // Extract and organize blocks from page content
  const [blockContentList] = organizePageBlocks(content);
  const blockTypes = extractBlockTypes(blockContentList);

  // Check for full-width content layout that requires special exception handling
  const hasFullWidthContent = content.body.page.fullWidthContent?.length > 0;

  // Process test exception content if full-width layout is detected
  const testExceptionContent = hasFullWidthContent
    ? extractBlockTypes(content.body.page.pageContent.map((page: any) => ({ ...page.model })))
    : null;

  // Build site information object for console display
  const siteInformation = {
    id: status === 200 ? content.body.contentLink.id : "N/A",
    status,
    name: content.body.name,
    url: content.body.url,
    testException: testExceptionContent,
    contentType: status === 200 ? content.body.contentType.pop() : "N/A",
    blockCount: blockTypes?.length || 0,
    types: blockTypes || "N/A",
  };

  // Display formatted information to console for debugging
  displayFormattedMessage(siteInformation, status);
}
