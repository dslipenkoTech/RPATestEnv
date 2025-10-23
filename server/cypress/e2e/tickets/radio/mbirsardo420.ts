import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBIRSARDO420", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Disable a 30-second button", () => {
    cy.wait(4000);
    cy.clickElement(".button-wrapper > .play");
    cy.verifyAttributeValue("#radio-body > div > section > div.player-wrapper > button.forward.player-btn", "disabled", "disabled");

    // Pause the music
    cy.clickElement("#radio-body > div.default-page > section > div.player-wrapper > button.pause.player-btn");
  });
});
