import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBISPANRDO306", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Hover state on the link button", () => {
    cy.wait(15000);
    //Hover state on the link button missing for Dark-Moody colors
    var MasEpisodios = ".bar > .EPiLink > span";
    cy.get(MasEpisodios).first().trigger("mouseover");
    cy.get(MasEpisodios).first().should("have.css", "color", "rgb(0, 115, 150)");
  });
});
