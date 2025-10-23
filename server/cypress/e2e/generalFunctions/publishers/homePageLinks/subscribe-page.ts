import { URLS } from "~cypress/environment";
import { header } from "~cypress/components/headerFooterComponents/publishers";
let envType: string = Cypress.env("CYPRESS_ENV_TYPE");

const link = Cypress.env("Pub") + "subscribe/";

describe("Subscribe Page", { tags: ["@subscribe-page", "@publishers", "@premise"] }, () => {
  beforeEach(() => URLS(link));

  header();

  it("Breadcrumb", () => {
    cy.pressEsc();
    let breadcrumbLink = [`.Breadcrumb`, `.Breadcrumb > a`];
    cy.loopVisible(breadcrumbLink);
    cy.hrefExists(breadcrumbLink[1]);
  });

  if (envType === "integration") {
    it("Find out what's new", () => {
      let allTextLink = [
        `h1 > b > span`,
        `:nth-child(2) > em`,
        `#block-b1659212261138 > .ao-form-label`,
        `#block-b1616770418680 > p > :nth-child(1)`,
        `#block-b1616770418680 > p > a`,
        `.ao-combo-label > span`,
      ];
      let inputName = [`First Name`, `E-mail Address`];
      let dateInputLink = [`#date-MM-b1659212261138`, `#date-DD-b1659212261138`, `#date-YYYY-b1659212261138`];

      cy.loopVisible(allTextLink);
      cy.hrefExists(`#block-b1616770418680 > p > a`);
      for (let i = 0; i < inputName.length; i++) cy.get(`input[name="${inputName[i]}"]`).type(`12345qwerty`);
      cy.get(dateInputLink[0]).type(`04`);
      cy.get(dateInputLink[1]).type(`19`);
      cy.get(dateInputLink[2]).type(`2001`);
      cy.visible(`.ao-form-submit`);
    });
  }

  it("Connect with us", () => {
    let allTextLink = [
      `h2 > b > span`,
      `[style="font-size: 1.4rem; line-height: 1.5rem; text-align: center;"] > strong`,
      `[style="font-size: 1rem; line-height: 1.5rem; text-align: center;"]`,
      `[style="font-size: 1rem; line-height: 1.5rem; text-align: center;"] > a`,
    ];
    let socialLink = [
      `https://www.instagram.com/moodypublishers/`,
      `https://www.facebook.com/moodypublishers/`,
      `https://twitter.com/MoodyPublishers`,
      `https://www.youtube.com/user/MoodyPro`,
      `mailto:moody.publishers@moody.edu`,
    ];
    for (let i = 0; i < socialLink.length; i++) {
      cy.visible(`[style="text-align: center;"] > [href="${socialLink[i]}"] > img`);
      cy.hrefExists(`[style="text-align: center;"] > [href="${socialLink[i]}"] > img`);
    }
    cy.loopVisible(allTextLink);
    cy.hrefExists(`[style="font-size: 1rem; line-height: 1.5rem; text-align: center;"] > a`);
  });
});
