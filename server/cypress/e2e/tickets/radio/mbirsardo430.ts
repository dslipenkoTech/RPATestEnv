import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");
let envType: string = Cypress.env("ENV_TYPE");

describe("MBIRSARDO430", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Headings", () => {
    cy.wait(15000);
    //"En vivo:" on the page "Inicio"
    var link = "#radio-body > div > div > div > main > section > div > div > div.text-wrapper > div.on-air" as string;

    cy.checkText(link, "En Vivo:");

    //"En vivo:" on the page "Escucha"
    cy.clickElement(".c2-list > :nth-child(2) > .EPiLink");
    cy.wait(4000);
    cy.visible("#radio-body > div > div > div > main > div.stream-hero-component.loaded > div > div > div.text-wrapper > div.on-air");

    //"MÁS RECIENTES" & "Más información". It doesn't work on qa
    cy.checkText("#Tabs-1-1 > h2", "Más reciente");
    cy.checkText("#Tabs-1-2 > h2", "Más información");

    //"Más episodios" in "Descubre"
    cy.wait(4000);
    cy.get(".c2-list > :nth-child(3) > .EPiLink").click();

    if (envType === "integration") {
      const link = ".EPiLink span";
      cy.visible(link);
    } else {
      var linkArray = [
        ":nth-child(1) > .podcasts-component > .container-bg > .section-header > .episodes > .EPiLink span",
        ":nth-child(2) > .podcasts-component > .container-bg > .section-header > .episodes > .EPiLink span",
      ] as string[];
      cy.loopVisible(linkArray);
    }
  });
});
