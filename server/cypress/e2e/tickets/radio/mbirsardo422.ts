import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBIRSARDO422", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Player stops playing when you use a search", () => {
    cy.clickElement(".button-wrapper > .play");
    cy.wait(2000);
    cy.clickElement(".search");
    cy.get("#search").type("conoce");

    cy.clickElement(".btn-submit > svg");
    cy.wait(1000);

    //Check if music is playing
    cy.verifyAttributeValue("#radio-body > div > section", "data-status", "playing");
    cy.clickElement("#radio-body > div > section > div.player-wrapper > button.pause.player-btn");
  });
});
