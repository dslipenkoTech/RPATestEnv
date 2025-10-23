import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-254`,
  tags: ["@ticket", "education"],
  pages: [
    [12794, "The Academics block needs to be updated to link directly to the Undergraduate and Graduate Directory Pages", firstIssue, {}],
  ],
};

function firstIssue() {
  compileTicketTesting(12794).then((content: any) => {
    let hasEduAcademicsBlocks = false;
    content.pageContent.forEach((block: any) => {
      const blockContent = block.model;
      if (blockContent.contentType[block.model.contentType.length - 1] === "EduAcademicsBlock") {
        hasEduAcademicsBlocks = true;
        const labels = blockContent.academicFeaturedContent.map((item: any) => item.label);
        expect(labels, "Should include 'Undergraduate' label").to.include("Undergraduate");
        expect(labels, "Should include 'Graduate' label").to.include("Graduate");

        const undergradItem = blockContent.academicFeaturedContent.find((item: any) => item.label === "Undergraduate");
        const gradItem = blockContent.academicFeaturedContent.find((item: any) => item.label === "Graduate");

        expect(undergradItem?.link?.href, "Undergraduate link should be '/undergrad/'").to.eq("/undergrad/");
        expect(gradItem?.link?.href, "Graduate link should be '/grad/'").to.eq("/grad/");
      }
      return;
    });
    if (!hasEduAcademicsBlocks) throw new Error("Update the test");
  });
}
regressionTesting(test);
