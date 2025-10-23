import { apiRequest, pageStatus } from "../page-api";
import { pageTypeList } from "./test-files.json";
import { pushApiContentModel } from "../functions";
import {
  addHeroBlock,
  getBlockFunction,
  errorMessage,
  testException,
  pageValidationErrorMsg,
  filterUnactiveBlockTypes,
  calculateBlockIndex,
} from "./block-handlers";

const envType = Cypress.env("ENV_TYPE");

export function pageBlockTesting(pageId: number) {
  // Fetch page content from API using the page ID
  return apiRequest(pageId).then((content: any) => {
    // Verify page returns valid status
    return pageStatus(content).then(() => {
      // Organize page content into testable block categories
      const [mainBlocks, pageTypeConfig, exceptionBlocks] = organizePageBlocks(content);

      // Extract page URL for testing navigation
      const url = content.body.url;

      // Run exception tests if they exist (secondary block testing)
      if (exceptionBlocks?.length > 0) {
        // Create modified config for exception testing
        const exceptionPageType = { ...pageTypeConfig, pageType: pageTypeConfig.pageType + "Exception" };
        runBlockTests(exceptionBlocks, exceptionPageType, url);
      }

      // Primary testing flow
      return runBlockTests(mainBlocks, pageTypeConfig, url);
    });
  });
}

export function organizePageBlocks(content: any): [any[], any, any[]] {
  const pageType = content.body?.contentType?.slice(-1)[0];

  // Find the configuration for this page type from the predefined list
  const pageTypeConfig = pageTypeList.find((config) => config.pageType === pageType);
  if (!pageTypeConfig) {
    pageValidationErrorMsg(pageTypeList, pageType);
    return [[], null, []];
  }

  let mainBlocks: any[] = []; // Primary blocks to test
  let exceptionBlocks: any[] = []; // Secondary/exception blocks to test separately

  // Handle special test exception cases (e.g., full page testing)
  if (pageTypeConfig.testException) {
    testException(pageTypeConfig, content, mainBlocks);
  } else {
    // Standard block processing flow

    // Filter out inactive/disabled blocks from page content
    const activePageContent = filterUnactiveBlockTypes(content.body?.page?.pageContent);

    // Add hero block
    addHeroBlock(pageTypeConfig.pageType, content, mainBlocks, pageTypeConfig);

    // Check if page has full-width content layout
    const hasFullWidthContent = content.body?.page?.fullWidthContent?.length > 0;

    if (hasFullWidthContent) {
      // Full-width layout: prioritize full-width blocks as main content
      content.body.page.fullWidthContent.forEach((block: any) => mainBlocks.push(block.model));

      // Move regular page content to exception blocks for separate testing
      pushApiContentModel(exceptionBlocks, content.body?.page?.pageContent, false);
    } else {
      // Standard layout
      pushApiContentModel(mainBlocks, activePageContent, false);
    }
  }

  // Return organized blocks: [main blocks, page config, exception blocks]
  return [mainBlocks, pageTypeConfig, exceptionBlocks];
}

function runBlockTests(blockList: any[], pageTypeConfig: any, url: string): void {
  // Go through each block and execute its specific test
  blockList.forEach((blockContent, i) => {
    // Extract block type
    const blockType = blockContent.contentType.slice(-1)[0];

    // Get the corresponding test function
    const blockFunction = getBlockFunction(blockType);

    // Calculate the correct index position
    const blockIndex = calculateBlockIndex(pageTypeConfig.pageType, i, envType);

    // Validate that this block type is supported
    errorMessage(pageTypeConfig, blockType);

    // Execute the block-specific test function
    blockFunction(url, blockContent, blockIndex, pageTypeConfig, false, null, 0, 0);
  });
}
