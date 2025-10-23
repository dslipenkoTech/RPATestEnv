import { URLS } from "~cypress/environment";

const link = Cypress.env("Edu") + "alumni/connect/news/2019/finding-your-roots/";

describe.skip("MBIRSAEDU144", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Padding", () => {
    //Padding isn't too big
    cy.get("#MainContent > div > div > aside").should("have.css", "padding", "60px 25px 0px 0px");
  });
});
