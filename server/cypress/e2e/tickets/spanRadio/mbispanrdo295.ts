import { URLS, viewport } from "~cypress/environment";

const link = Cypress.env("Spanradio");
let envType: string = Cypress.env("CYPRESS_ENV_TYPE") || "qa";

describe("MBISPANRDO295", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Homepage hero banner | Iphone", () => {
    if (envType == "www" || envType == "stage") return;
    viewport(true);
    //The play button stays blue after cy.cy.clicking on it
    var playBtn = ".button-wrapper > .play";
    var stopBtn = "#radio-body > div > section > div.player-wrapper > button.pause.player-btn";

    cy.clickElement(playBtn);
    cy.clickElement(stopBtn);
    cy.get("#radio-body > div > div > div > main > section > div > div > div.button-wrapper > button")
      .trigger("mouseover")
      .should("have.css", "background-color", "rgb(121, 155, 61)");
  });
});
