import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-274`,
  tags: ["@ticket", "bible"],
  pages: [[12794, "CTA buttons should be less than 4 in Simple Callout Block", firstIssue, { tags: ["@test"] }]],
};

function firstIssue() {
  compileTicketTesting(12794).then((content: any) => {
    let hasEduSimpleCalloutBlocks = false;
    content.pageContent.forEach((block: any) => {
      const blockContent = block.model;
      if (blockContent.contentType[block.model.contentType.length - 1] === "EduSimpleCalloutBlock") {
        hasEduSimpleCalloutBlocks = true;
        if (blockContent.ctaButtons.length > 4) {
          throw new Error("CTA buttons has more than 4 in Simple Callout Block");
        }
      }
      return;
    });
    if (!hasEduSimpleCalloutBlocks) throw new Error("Update the test");
  });
}

regressionTesting(test);
