import { validateSelectors } from "../functions";

export function eduDepartmentsAndOfficesDirectoryPageBlock(url: string, content: any, i: number, pageTypeObject: string) {
  cy.log("[EduDepartmentsAndOfficesDirectoryPageBlock]()");
  const functionName = "eduDepartmentsAndOfficesDirectoryPageBlock";

  cy.visit(url).then(() => {
    const main = {
      heroHeading: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > h1`,
        content: content.hero?.heading,
      },
      heroSubheading: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > p`,
        content: content.hero?.subheading,
      },
      heroTag: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > span`,
        content: content.hero?.tag,
      },
      searchPlaceholder: {
        selector: `div.col-span-12.pb-6 > div:nth-child(2) > div > input`,
        content: content.searchPlaceholder,
        attribute: "placeholder",
      },
      category: {
        selector: `div.col-span-12.pb-6 > div:nth-child(1) > span`,
        content: content.category?.name,
      },
    };
    validateSelectors(main, functionName);
  });
}
