import { URLS } from "~cypress/environment";

const link =
  Cypress.env("Pub") +
  `search/?z=1618237584896&facets=%5B%7B"GroupFieldName"%3A"Format"%2C"Facets"%3A%5B%7B"Key"%3A"eBook"%2C"Selected"%3Atrue%7D%5D%7D%5D&page=1&mode=facets&tab=product&pageSize=8&q=bible&sort=`;

describe("MBIPUB318", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Filtered formats do not update products", () => {
    cy.textExists("eBook");
    cy.wait(3000);
    var eBookList = [
      ":nth-child(1) > .resultcontent > .pricing > .bookFormat",
      ":nth-child(2) > .resultcontent > .pricing > .bookFormat",
      ":nth-child(3) > .resultcontent > .pricing > .bookFormat",
      ":nth-child(4) > .resultcontent > .pricing > .bookFormat",
      ":nth-child(5) > .resultcontent > .pricing > .bookFormat",
      ":nth-child(6) > .resultcontent > .pricing > .bookFormat",
      ":nth-child(7) > .resultcontent > .pricing > .bookFormat",
      ":nth-child(8) > .resultcontent > .pricing > .bookFormat",
    ];
    eBookList.forEach((book) => {
      cy.visible(book);
    });
  });
});
