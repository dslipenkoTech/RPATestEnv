import { validateSelectors } from "../functions";

export function eduProgramFinderBlock(url: string, content: any, i: number, pageTypeObject: any) {
  cy.log("[EduProgramFinderBlock]()");
  const functionName = "eduProgramFinderBlock";

  cy.visit(url).then(() => {
    const main = {
      title: {
        selector:
          "section.Edu.program-finder-block.relative.h-auto.w-full.bg-cyan-800.px-4 > div > div.justify-center.gap-2.text-3xl.leading-tight> h2",
        content: content.title,
      },
      description: {
        selector: "section.Edu.program-finder-block.relative.h-auto.w-full.bg-cyan-800.px-4 > div > div.justify-center.gap-4 > div > label",
        content: content.description,
      },
    };
    validateSelectors(main, functionName);

    content.links?.forEach((link: { title: string; href: string; text: string }, y: number) => {
      const linkObject = {
        text: {
          selector: `section.Edu.program-finder-block.relative.h-auto.w-full.bg-cyan-800.px-4 > div > div.justify-center.gap-4 > ul > li:nth-child(${
            y + 1
          }) > a`,
          content: link.text,
        },
        btnUrl: {
          selector: `section.Edu.program-finder-block.relative.h-auto.w-full.bg-cyan-800.px-4 > div > div.justify-center.gap-4 > ul > li:nth-child(${
            y + 1
          }) > a`,
          content: link.href,
          removeQueryString: true,
        },
      };
      validateSelectors(linkObject, functionName);
    });
  });
}
