import { validateSelectors } from "../functions";

export function eduProgramFinderPageBlock(url: string, content: any, i: number, pageTypeObject: string) {
  cy.log("[EduProgramFinderPageBlock]()");
  const functionName = "eduProgramFinderPageBlock";

  cy.visit(url).then(() => {
    const main = {
      heroHeading: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > h1`,
        content: content.hero?.model?.heading,
      },
      heroSubheading: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > p`,
        content: content.hero?.model?.subheading,
      },
      heroTag: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > span`,
        content: content.hero?.model?.tag,
      },
      searchPlaceholder: {
        selector: `div > div:nth-child(3) > div > div > div.w-full > div > div.relative > input`,
        content: content.searchPlaceholder,
        attribute: "placeholder",
      },
      clearAllLabel: {
        selector: `div > div:nth-child(3) > div > div > button`,
        content: content.clearAllLabel,
      },
      school: {
        selector: `div > div:nth-child(3) > div > div > div:nth-child(1) > div.mb-1.text-sm.font-medium`,
        content: content.school?.name,
      },
      location: {
        selector: `div > div:nth-child(3) > div > div > div:nth-child(3) > div.mb-1.text-sm.font-medium`,
        content: content.location?.name,
      },
      fieldOfStudy: {
        selector: `div > div:nth-child(3) > div > div > div:nth-child(2) > div.mb-1.text-sm.font-medium`,
        content: content.fieldOfStudy?.name,
      },
      degreeLevel: {
        selector: `div > div:nth-child(3) > div > div > div:nth-child(4) > div.mb-1.text-sm.font-medium`,
        content: content.degreeLevel?.name,
      },
    };
    validateSelectors(main, functionName);

    // School
    for (let y = 1; y <= content.school?.values.length; y++) {
      const schoolElement = {
        school: {
          selector: `div > div:nth-child(3) > div > div > div:nth-child(1) > div:nth-child(2) > div > ul > li:nth-child(${y})`,
          content: content.school.values[y - 1].term,
        },
      };
      validateSelectors(schoolElement, functionName);
    }

    // Location
    for (let y = 1; y <= content.location?.values.length; y++) {
      const locationElement = {
        location: {
          selector: `div > div:nth-child(3) > div > div > div:nth-child(3) > div:nth-child(2) > div > ul > li:nth-child(${y})`,
          content: content.location.values[y - 1].term,
        },
      };
      validateSelectors(locationElement, functionName);
    }

    // Field of Study
    for (let y = 1; y <= content.fieldOfStudy?.values.length; y++) {
      const fieldOfStudyElement = {
        fieldOfStudy: {
          selector: `div > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(2) > div > ul > li:nth-child(${y})`,
          content: content.fieldOfStudy.values[y - 1].term,
        },
      };
      validateSelectors(fieldOfStudyElement, functionName);
    }

    // Degree Level
    for (let y = 1; y <= content.degreeLevel?.values.length; y++) {
      const degreeLevelElement = {
        degreeLevel: {
          selector: `div > div:nth-child(3) > div > div > div:nth-child(4) > div:nth-child(2) > div > ul > li:nth-child(${y})`,
          content: content.degreeLevel.values[y - 1].term,
        },
      };
      validateSelectors(degreeLevelElement, functionName);
    }
  });
}
