import * as blockTypes from "../blockTypes/index";
import { pushApiContentModel } from "../functions";
import path from "path";

interface PageTypeObject {
  blocks: string[];
}

// Validates that a block type is supported for the given page type configuration
// Throws an error with debugging information if block type is not found in Cypress
export function errorMessage(pageTypeObject: PageTypeObject, blockType: string) {
  if (!pageTypeObject.blocks.includes(blockType)) {
    const otherFilePath: string = path.join(__dirname, "../blockTesting/test-files.json");
    throw new Error(
      `**BlockType '${blockType}'** isn't found in pageTypeList. See available types in the console.  \n\n Path: ${otherFilePath}`
    );
  }
}

// Displays available page types and throws an error when an unsupported page type is encountered
export function pageValidationErrorMsg(pageTypeList: any[], pageType: string) {
  console.log(
    "Available page types:",
    pageTypeList.map((el) => el.pageType)
  );

  const otherFilePath = path.join(__dirname, "test-files.json");
  throw new Error(
    `PageType **"${pageType}"** was not found in pageTypeList. See available types in the console. \n\n Path: ${otherFilePath}`
  );
}

// Retrieves the test function for a specific block type from the blockTypes module in index.ts
export function getBlockFunction(blockType: string) {
  const blockFunction = blockTypes[blockType as keyof typeof blockTypes];
  if (typeof blockFunction === "function") {
    return blockFunction;
  }
  throw new Error(
    `Function [${blockType}]() not found in blockTypes \n\n To fix: \n 1. add a new function in _apiFunctions/blockTypes/index.ts_ \n 2. Create a new file with the same name in _blockTypes_`
  );
}

// Calculates the correct index position for a block on the page based on page type and environment
// Different page types have different starting positions due to hero blocks and layout differences
export function calculateBlockIndex(pageType: string, baseIndex: number, envType: string): number {
  if (pageType.includes("TitwHomePage")) return baseIndex + 2;
  if (pageType.includes("EduHomePage")) return envType === "production" || envType === "prod" ? baseIndex + 2 : baseIndex + 1;
  if (pageType.includes("EduLandingPage") || pageType.includes("EduDirectoryLandingPage")) return baseIndex;
  return baseIndex + 1;
}

// Filters out inactive or disabled blocks from page content based on predefined rules
// Prevents testing of blocks that shouldn't be displayed (e.g., a block only with a description)
export function filterUnactiveBlockTypes(pageContent: any) {
  if (!pageContent) return [];
  if (!Array.isArray(pageContent)) return pageContent;

  const skipRules: Record<string, (model: any) => boolean> = { EduAcademicsBlock: (m) => m.academicFeaturedContent.length === 0 };

  return pageContent.filter((el: any) => {
    const model = el?.model;
    const typeList = model?.contentType;
    const blockName = Array.isArray(typeList) ? typeList[typeList.length - 1] : undefined;

    if (!blockName || !model) return true;
    const shouldSkip = skipRules[blockName]?.(model) === true;
    return !shouldSkip;
  });
}

// Handles special test exception cases where normal block processing doesn't apply
// Some smaller pages don't have the object structure, therefore we need to test the entire page as a single block
export function testException(pageTypeObject: any, content: any, blockContentList: any[]) {
  if (pageTypeObject.testException === "testFullPage") {
    const pageBlock = { model: { ...content.body.page, contentType: [`${pageTypeObject.pageType}Block`] } };
    content.body.page && pushApiContentModel(blockContentList, pageBlock.model, true);
  } else {
    throw new Error(`TestException ${pageTypeObject.testException} is not supported`);
  }
}

// Adds the hero block to the blockContentList
export function addHeroBlock(pageType: string, content: any, blockContentList: any[], pageTypeObject: any) {
  switch (pageType) {
    case "MoodyBibleHomePage":
      const mbiHeroBlock = { ...content.body.page.hero, contentType: [`MbiHeroBannerBlock`] };
      content.body.page.hero && blockContentList.push(mbiHeroBlock);

      const ministrySelectorBlock = { ...content.body.page.ministrySelector, contentType: [`MinistrySelectorBlock`] };
      content.body.page.ministrySelector && blockContentList.push(ministrySelectorBlock);
      break;

    case "LandingPage":
      let heroContent = content.body?.page?.heroContent || content.body?.page?.heroModel;
      if (heroContent) pushApiContentModel(blockContentList, heroContent, !!content.body.page.heroModel);
      else throw new Error("Hero content for LandingPage is null or undefined");
      break;

    case "EduLandingPage":
      let EduLandingHeroBlock = content.body?.page?.heroContent || content.body?.page?.heroModel;
      if (EduLandingHeroBlock) pushApiContentModel(blockContentList, EduLandingHeroBlock, !!content.body.page.heroModel);
      else throw new Error("Hero content for EduLandingPage is null or undefined");
      break;

    case "EduHomePage":
      let eduHeroContent = content.body?.page?.heroContent?.model;
      if (eduHeroContent) pushApiContentModel(blockContentList, eduHeroContent, !!content.body.page.heroContent.model);
      else throw new Error("Hero content for EduHomePage is null or undefined");
      break;

    case "TitwLandingPage":
      let titwHeroContent = content.body?.page?.heroContent || content.body?.page?.heroModel;
      let titwHeroTitle = content.body?.page?.cardTitle && content.body?.page;
      const titwLandingPageBlock = { model: { ...content.body.page, contentType: [`${pageTypeObject.pageType}Block`] } };

      // If the hero content is a HeroBlock, change the contentType to
      // TitwLandingPageHeroBlock and push it to the blockContentList
      if (titwHeroContent && titwHeroContent.contentType.slice(-1)[0] === "HeroBlock") {
        titwHeroContent.contentType[titwHeroContent.contentType.length - 1] = "TitwLandingPageHeroBlock";
      }

      if (titwHeroContent) pushApiContentModel(blockContentList, titwHeroContent, !!content.body?.page?.heroModel);
      else if (titwHeroTitle) pushApiContentModel(blockContentList, titwLandingPageBlock.model, true);
      else throw new Error("Hero content for TitwLandingPage is null or undefined");
      break;

    case "TitwHomePage":
      const titwHomePagePath = content.body?.page?.heroContent[0].model;
      titwHomePagePath && pushApiContentModel(blockContentList, { ...titwHomePagePath, contentType: [`TitwHomeHeroBlock`] }, true);
      break;

    case "GeneralDetailPage":
      const generalDetailPagePath = content.body?.page;
      if (generalDetailPagePath) {
        pushApiContentModel(blockContentList, generalDetailPagePath, true);
        content.body?.page?.heroContent && pushApiContentModel(blockContentList, content.body.page.heroContent);
      } else throw new Error("Content for GeneralDetailPage is null or undefined");
      break;

    case "TitwGeneralDetailPage":
      const titwGeneralDetailPagePath = content.body?.page;
      if (titwGeneralDetailPagePath) {
        const pageBlock = { model: { ...titwGeneralDetailPagePath, contentType: [`TitwGeneralDetailPageBlock`] } };
        pushApiContentModel(blockContentList, pageBlock.model, true);
      } else throw new Error("Content for TitwGeneralDetailPage is null or undefined");
      break;

    case "EduGeneralDetailPage":
      // Check for error pages
      const errorPage = content.body?.routeSegment === "404";
      const eduGeneralDetailPagePath = content.body?.page?.hero?.model;
      if (eduGeneralDetailPagePath) pushApiContentModel(blockContentList, eduGeneralDetailPagePath, true);
      else if (errorPage) {
        const errorPageBlock = { model: { ...content.body.page, contentType: [`EduErrorPageBlock`] } };
        pushApiContentModel(blockContentList, errorPageBlock.model, true);
      } else throw new Error("Content for EduGeneralDetailPage is null or undefined");
      break;

    case "EduDirectoryLandingPage":
      const eduDirectoryLandingPagePath = content.body?.page?.heroModel;
      if (eduDirectoryLandingPagePath) pushApiContentModel(blockContentList, eduDirectoryLandingPagePath, true);
      else throw new Error("Content for EduDirectoryLandingPage is null or undefined");
      break;

    default:
      const defaultHeroContent = content.body?.page?.heroContent;
      if (defaultHeroContent) pushApiContentModel(blockContentList, defaultHeroContent, true);
      else throw new Error("Hero content for default page is null or undefined");
  }
}
