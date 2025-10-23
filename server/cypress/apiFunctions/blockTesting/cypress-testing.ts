import { pageBlockTesting } from "./block-testing";
import { getWebInfo } from "../site-information";
import { Test } from "../../types/cypress-types";

export function cypressBlockTesting(test: Test) {
  // Determines either the whole test should be skipped or not
  describe(test.name, () => {
    it("Get website information", () => getWebInfo(test.pages));
    const savedContent = Cypress.env("savedContent");
    savedContent.body.page.pageContent.forEach((page: any) => it("Display page", () => console.log(page)));
  });
}
