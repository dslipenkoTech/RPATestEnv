import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { validateSelectors } from "~cypress/apiFunctions/functions";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-220`,
  tags: ["@ticket", "bible"],
  pages: [[14, "CTA buttons should be less than 4 in Simple Callout Block", firstIssue, {}]],
};

function firstIssue() {
  compileTicketTesting(14).then((content: any) => {
    content.filterByMinistryMenu.items.forEach((item: any, index: number) => {
      const selector = `#bible-app > div > main > div > div > div.md\\:w-1\\/3.space-y-14 > div.space-y-9.hidden.md\\:block > ul > li:nth-child(${
        index + 1
      }) > a`;
      const ministry = {
        text: { selector: selector, content: item.text },
        hrefUrl: { selector: selector, content: item.href },
      };
      validateSelectors(ministry, "NewsIndexPageBlock");
    });
  });
}

regressionTesting(test);
