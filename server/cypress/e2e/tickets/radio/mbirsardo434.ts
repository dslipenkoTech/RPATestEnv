import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBIRSARDO434", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("No caps heading", () => {
    //En vivo "Inicio"
    cy.checkText(".big-links-list > :nth-child(1)", " Inicio ");

    //En vivo "Escucha"
    cy.clickElement(".c2-list > :nth-child(2) > .EPiLink");
    cy.wait(2000);
    cy.checkText(".big-links-list > :nth-child(2)", " Escucha ");

    //Descubre
    cy.wait(2000);
    cy.checkText(".big-links-list > :nth-child(3)", " Descubre ");
  });
});
