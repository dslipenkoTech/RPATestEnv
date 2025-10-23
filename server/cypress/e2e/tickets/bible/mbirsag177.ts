import { URLS } from "~cypress/environment";

const link = Cypress.env("Edu") + "academics/programs/bs-ministry-leadership/";

describe.skip("MBIRSAG177", { tags: ["@bible", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Headings", () => {
    cy.checkText("h1", "BS in Ministry Leadership");
    const h2Links = [
      '[style="background-color:  #cf912a"] > .wrapper > .content > .title',
      ":nth-child(2) > .Accordion-block > .wrapper > .content > .title",
      ".Accordion-block.dark > .wrapper > .content > .title",
      '[style="background-color:  #4298b5"] > .wrapper > .content > .title',
      ".Color-block.dark > .wrapper > .content > .title",
    ];
    cy.loopVisible(h2Links);
    cy.visible(".content > h3");
  });
});
