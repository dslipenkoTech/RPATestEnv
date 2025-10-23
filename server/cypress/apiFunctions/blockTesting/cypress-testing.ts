import { pageBlockTesting } from "./block-testing";
import { apiRequest } from "../page-api";
import { getWebInfo } from "../site-information";
import { Test } from "../../types/cypress-types";

import axios from "axios";

export function cypressBlockTesting(test: Test) {
  describe(test.name, () => {
    it("Get website information", () => getWebInfo(test.pages));
    const savedContent = Cypress.env("savedContent");
    console.log(savedContent);
    // savedContent.body.page.pageContent.forEach((page: any) => it("Display page", () => console.log(page)));
  });
}
