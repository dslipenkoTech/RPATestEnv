import { getWebInfo } from "../site-information";
import { ticketTest } from "../../types/cypress-types";
import { apiRequest } from "../page-api";

const norm = (
  tc: ticketTest["pages"][number]
): [number, string, (() => void) | undefined, { skip?: boolean; isolate?: boolean; tags?: string[] }] =>
  Array.isArray(tc) ? [Number(tc[0]), tc[1] || "", tc[2], tc[3] || {}] : [Number(tc as number), "", undefined, {}];

export function regressionTesting(test: ticketTest) {
  (test.skip ? describe.skip : describe)(test.name, { tags: [...(test.tags || []), "@dxp"] }, () => {
    // Isolate the pages that need to be tested individually
    const isolated = test.pages.filter((tc) => (Array.isArray(tc) ? tc[3]?.isolate : false));
    const infoIt = isolated.length ? it.only : it;
    infoIt("Get website information", () => getWebInfo(isolated.length ? isolated : test.pages));

    test.pages.forEach((tc) => {
      const [pageId, desc, fn, opt] = norm(tc);
      const title = desc ? `ID: ${pageId} - ${desc}` : `Test for page ${pageId}`;
      (opt.skip ? it.skip : opt.isolate ? it.only : it)(title, { tags: opt.tags }, () => dxpTicketTesting(fn, pageId));
    });
  });
}

export const compileTicketTesting = (pageId: number) => apiRequest(pageId).then((c: any) => cy.visit(c.body.url).then(() => c.body.page));

export const dxpTicketTesting = (test: (() => void) | undefined, _page: number) => test?.();
