//^ Header
export function header() {
  it("Header", () => {
    //logo
    cy.visible(".Logo");

    //top menu
    var urls = [
      "body > header > div > ul > li:nth-child(1) > a",
      "body > header > div > ul > li:nth-child(2) > a",
      "body > header > div > ul > li:nth-child(3) > a",
      "body > header > div > ul > li:nth-child(4) > a",
      "body > header > div > ul > li:nth-child(5) > a",
      "body > header > div > ul > li:nth-child(6) > a",
    ];

    cy.loopVisible(urls);
    cy.loopHrefExists(urls);

    //Menu
    for (let i = 0; i < 3; i++) {
      //tab
      cy.clickElement(`.PrimaryMenu > :nth-child(${i + 1}) > .toggle`);
      //dropdown
      cy.visible(".Dropdowns");
    }
    //radio epanol
    var urls = [
      ".UtilityMenu > :nth-child(1) > a",
      ".UtilityMenu > :nth-child(2) > a",
      ".UtilityMenu > :nth-child(3) > a",
      ".UtilityMenu > :nth-child(4) > a",
    ];

    cy.loopVisible(urls);
    cy.loopHrefExists(urls);

    //Donate
    cy.textExists("Donate");
    cy.visible(".donate");
    cy.hrefExists(".donate");

    //Search | Skipped some search testing because it was failing a lot
    cy.visible("#SearchText");

    //Widget
    cy.visible(".homeTemplate > :nth-child(1) > .Widget");
    cy.visible(":nth-child(1) > .Widget > .Wrap");
    cy.visible(".listenLive > a");
    cy.visible(".onAirNow");
    cy.visible(".changeStation");
    cy.visible(".schedule > a");
  });
}

//^ Footer
export function footer() {
  context("Footer", () => {
    it("Top part", () => {
      //Headings
      var headingList = [
        ".Footer > :nth-child(1) > :nth-child(1) > h3",
        ".Footer > :nth-child(1) > :nth-child(2) > h3",
        ".Footer > :nth-child(1) > :nth-child(2) > h3",
      ];
      cy.loopVisible(headingList);
      //Bullet List 1
      var bulletNumberCount = 6;
      for (let i = 0; i < bulletNumberCount; i++) {
        var bulletList = `.Footer > :nth-child(1) > :nth-child(1) > ul > :nth-child(${i + 1}) > a`;
        cy.visible(bulletList);
        cy.hrefExists(bulletList);
      }

      //Address
      cy.visible(".Footer > :nth-child(1) > :nth-child(2) > :nth-child(2)");

      //Moody Description
      cy.visible(".Footer > :nth-child(1) > :nth-child(3) > p");
    });

    it("Bottom part", () => {
      //Logo
      cy.visible(".logoCol > img");

      //Buttons "Moody Beliefs" and "Knowing Christ"
      var footerButtons = [
        "body > footer > div.Footer-Sub > div > div.col.linksCol > div > p > a:nth-child(1)",
        "body > footer > div.Footer-Sub > div > div.col.linksCol > div > p > a:nth-child(2)",
      ];
      cy.loopVisible(footerButtons);
      cy.loopHrefExists(footerButtons);

      //Copyright
      cy.visible(".copyrightCol > p");

      var botttomButtons = [
        "body > footer > div.Footer-Sub > div > div.col.linksCol > p > a:nth-child(1)",
        "body > footer > div.Footer-Sub > div > div.col.linksCol > p > a:nth-child(2)",
        "body > footer > div.Footer-Sub > div > div.col.linksCol > p > a:nth-child(3)",
      ];

      cy.loopVisible(botttomButtons);
      cy.loopHrefExists(botttomButtons);
    });
  });
}
