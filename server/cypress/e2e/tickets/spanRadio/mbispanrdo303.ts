import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBISPANRDO303", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Homepage hero banner", () => {
    //The play/stop button inconsistency
    cy.clickElement(".button-wrapper > .play");

    //Check the icon
    cy.visible("#radio-body > div > section > div.player-wrapper > button.pause.player-btn");

    //Pause
    cy.clickElement("#radio-body > div > section > div.player-wrapper > button.pause.player-btn");
  });
});
