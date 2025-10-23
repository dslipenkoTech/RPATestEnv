import { validateSelectors } from "../functions";

export function eduCourseSyllabusPageBlock(url: string, content: any, i: number, pageTypeObject: string) {
  cy.log("[EduCourseSyllabusPageBlock]()");
  const functionName = "eduCourseSyllabusPageBlock";

  console.log("content", content);
  cy.visit(url).then(() => {
    const main = {
      heroModelHeading: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > h1`,
        content: content.heroModel.heading,
      },
      heroModelSubheading: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > p`,
        content: content.heroModel.subheading,
      },
      heroModelTag: {
        selector: `section.Edu.hero-no-image.hero-no-image-block > div > div > span`,
        content: content.heroModel.tag,
      },
      mainBodyHtml: {
        selector: `div.Edu.course-syllabus-page.container.mx-auto > div > section:nth-child(3) > section`,
        content: content.mainBodyHtml,
      },
    };
    validateSelectors(main, functionName);

    Object.values(content.courseSyllabus)?.forEach((courseArr: any, y: number) => {
      if (courseArr.length > 0) {
        cy.get(`div.Edu.course-syllabus-page.container > div > div.mb-5.flex.flex-wrap > div:nth-child(${y + 1})`).click();

        courseArr.course?.forEach((course: any, x: number) => {
          cy.get(
            `div.Edu.course-syllabus-page.container > div > div.flex.flex-col > div:nth-child(${y + 1}) > div:nth-child(${
              x + 1
            }) > button > span.font-proxima.text-left.text-sm`
          ).click();

          const courseObject = {
            title: {
              selector: `div.Edu.course-syllabus-page.container > div > div.flex.flex-col > div:nth-child(${y + 1}) > div:nth-child(${
                x + 1
              }) > button > span.font-proxima.text-left.text-sm`,
              content: course.title,
            },
          };
          validateSelectors(courseObject, functionName);
        });
      } else {
        cy.get(`div.Edu.course-syllabus-page.container > div > div.mb-5.flex.flex-wrap > div:nth-child(${y + 1})`)
          .should("have.class", "pointer-events-none")
          .and("have.attr", "tabindex", "-1")
          .and("have.class", "text-gray-400");
      }
    });
  });
}
