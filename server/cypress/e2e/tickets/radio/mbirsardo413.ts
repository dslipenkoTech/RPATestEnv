import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBIRSARDO413", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Play button", () => {
    cy.wait(10000);

    cy.clickElement(".button-wrapper > .play");
    //When hover the play button music shouldn't stop
    const playBtn = "#radio-body > div > section > div.player-wrapper > button.pause.player-btn";
    cy.get(playBtn).trigger("mouseover");

    cy.wait(1000);
    cy.expectPlayingMedia();

    // Pause the music
    cy.clickElement("#radio-body > div.default-page > section > div.player-wrapper > button.pause.player-btn");
  });

  it("Play button", () => {
    cy.wait(10000);

    cy.clickElement(".button-wrapper > .play");
  });
});
