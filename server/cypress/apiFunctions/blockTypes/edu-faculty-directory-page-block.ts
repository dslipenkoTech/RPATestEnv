import { validateSelectors } from "../functions";

export function eduFacultyDirectoryPageBlock(url: string, content: any, i: number, pageTypeObject: string) {
  cy.log("[EduFacultyDirectoryPageBlock]()");
  const functionName = "eduFacultyDirectoryPageBlock";

  cy.visit(url).then(() => {
    const main = {
      heroModelHeading: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > h1`,
        content: content.heroModel?.heading,
      },
      heroModelSubheading: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > p`,
        content: content.heroModel?.subheading,
      },
      heroModelTag: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > span`,
        content: content.heroModel?.tag,
      },
      searchPlaceholder: {
        selector: `section.mb-5 > div > div > div.w-full > div > div.relative.border-l.pl-3 > input`,
        content: content.searchPlaceholder,
        attribute: "placeholder",
      },
      clearAllLabel: {
        selector: `section.mb-5 > div > div > button`,
        content: content.clearAllLabel,
      },
      school: {
        selector: `section.mb-5 > div > div > div:nth-child(1) > div.mb-1.text-sm.font-medium`,
        content: content.school?.name,
      },
      department: {
        selector: `section.mb-5 > div > div > div:nth-child(3) > div.mb-1.text-sm.font-medium`,
        content: content.department?.name,
      },
    };
    validateSelectors(main, functionName);

    // School
    for (let y = 2; y <= content.school?.values.length; y++) {
      const schoolElement = {
        school: {
          selector: `section.mb-5 > div > div > div:nth-child(1) > div:nth-child(2) > div > ul > li:nth-child(${y})`,
          content: content.school.values[y - 2].term,
        },
      };
      validateSelectors(schoolElement, functionName);
    }

    // Department
    for (let y = 2; y <= content.department?.values.length; y++) {
      const departmentElement = {
        department: {
          selector: `section.mb-5 > div > div > div:nth-child(3) > div:nth-child(2) > div > ul > li:nth-child(${y})`,
          content: content.department.values[y - 2].term,
        },
      };
      validateSelectors(departmentElement, functionName);
    }
  });
}
