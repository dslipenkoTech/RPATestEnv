import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBIRSARDO421", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Playing dual audio", () => {
    cy.wait(10000);
    cy.clickElement(".button-wrapper > .play");
    cy.wait(2000);

    //When a podcast playing main "play" button should be disabled
    var pausedButton = "#radio-body > div.default-page > section > div.player-wrapper > button.pause.player-btn";
    cy.verifyClass(pausedButton, "pause");
    cy.clickElement(".player-wrapper > .pause");
  });
});
