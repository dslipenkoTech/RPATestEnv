//^ Heading
export function header() {
  context("Header", () => {
    it("Top menu", () => {
      //Buttons at the top
      for (let i = 0; i < 5; i++) {
        var listOfButtons = `.submenu-links > .link-container > :nth-child(${i + 1}) > a`;
        cy.visible(listOfButtons);
        cy.hrefExists(listOfButtons);
      }

      //Search input
      var searchInput = ".search-box > #site-search";
      var testText = "its testing search input";
      cy.get(searchInput).type(`${testText}{enter}`);
      cy.wait(1000);
      cy.go(-1);

      //Right side buttons
      for (let i = 0; i < 2; i++) {
        var buttons = `.sub-menu-inner-container > .cta-container > .link-container > :nth-child(${i + 1}) > a`;
        cy.visible(buttons);
        cy.hrefExists(buttons);
      }

      //Apply button
      var applyButton = ".sub-menu-inner-container > .cta-container > .link-container > :nth-child(3) > .gold";
      cy.visible(applyButton);
      cy.hrefExists(applyButton);
    });

    it("Main menu", () => {
      //Logo
      cy.visible(".logo-dt");

      //Menu bar
      cy.get("#Main-menu").each(($el) => {
        cy.wrap($el)
          .find("div.detail-dt > a")
          .each(($link) => {
            cy.wrap($link).should("have.attr", "href").and("not.be.empty");
          });
      });
    });
  });
}

//^ Page Banner
export function pageBanner() {
  it("Should display page banner correctly", () => {
    cy.visible("#Page-banner > .container");
    cy.visible("h1");
  });
}

//^ Left Side Block
export function leftSideBlocks(href1: string, href2: string, href3: string) {
  it("Left side bottom", () => {
    var urls = [
      ".desktop-cta > .Cta-icons > .list > :nth-child(1) > .ctaRequest",
      ".desktop-cta > .Cta-icons > .list > :nth-child(2) > .ctaVisit",
      ".desktop-cta > .Cta-icons > .list > :nth-child(3) > .ctaApply",
    ];
    var urlsNames = [
      ".desktop-cta > .Cta-icons > .list > :nth-child(1) > .ctaRequest > .desktop-title",
      ".desktop-cta > .Cta-icons > .list > :nth-child(2) > .ctaVisit > .desktop-title",
      ".desktop-cta > .Cta-icons > .list > :nth-child(3) > .ctaApply > .desktop-title",
    ];
    var headings = [
      "\n                        Request Info\n                    ",
      "\n                        Visit Campus\n                    ",
      "\n                        Apply Now\n                    ",
    ];
    var hrefs = [href1, href2, href3];
    var urlsAs = [
      "#MainContent > div > div > aside > div.desktop-cta > section > ul > li:nth-child(1) > a",
      "#MainContent > div > div > aside > div.desktop-cta > section > ul > li:nth-child(2) > a",
      "#MainContent > div > div > aside > div.desktop-cta > section > ul > li:nth-child(3) > a",
    ];
    cy.loopVisible(urls);
    cy.loopVisible(urlsNames);
    cy.loopCheckText(urlsNames, headings);
    cy.loopVerifyHref(urlsAs, hrefs);
  });
}

//^ Left Side Menu
export function leftSideMenu() {
  it("Left side menu", () => {
    var urls = [
      "#MainContent > div > div > aside > nav > div > div:nth-child(2)",
      "#MainContent > div > div > aside > nav > div > div:nth-child(3)",
    ];

    for (let i = 0; i < urls.length; i++) {
      cy.clickElement(urls[i]);
      cy.visible('[data-status="expanded"] > .panel');
    }
  });
}

//^ Color Block
export function colorBlock() {
  it("Color block", () => {
    cy.visible(".Color-block");
    cy.visible(".wrapper > .content > .title");
    cy.visible(".wrapper > .content > p");
  });
}

//^ Programs Blocks
export function programsBlocks(link: string, y: number) {
  cy.visible(".section-title");
  cy.visible("#Explore-programs");
  for (let i = 0; i < y; i++) {
    var links = [
      `${link}:nth-child(${i + 1}) > .wrap > :nth-child(1) > .featured-image`,
      `${link}:nth-child(${i + 1}) > .wrap > :nth-child(1) > .featured-image > .featured-content > .title`,
      `${link}:nth-child(${i + 1}) > .wrap > :nth-child(1) > .featured-image > .featured-content > .category`,
      `${link}:nth-child(${i + 1}) > .wrap > .card > .desc > p`,
      `${link}:nth-child(${i + 1}) > .wrap > .card > .chev-btn`,
    ];
    cy.loopVisible(links);
  }
}

//^ Footer
export function footer() {
  it("Footer", () => {
    cy.get("footer.site-footer").should("exist");
    cy.get("footer .logo a").should("have.attr", "href", "/");
    cy.get("footer .logo img").should("have.attr", "src").and("include", "moody_white_small.png");
    cy.get("footer .location-list").should("exist");
    cy.get("footer .location-list a").should("have.attr", "href").and("not.be.empty");
    cy.get("#footerAccordionTarget1").should("exist").click();
    cy.get("#footerAccordionPanel1").should("be.visible");
    cy.get("#footerAccordionPanel1 .nav-list a").should("have.length.greaterThan", 0);
    cy.get("#footerAccordionTarget2").should("exist").click();
    cy.get("#footerAccordionPanel2").should("be.visible");
    cy.get("#footerAccordionPanel2 .col-sm-6 a").should("have.length.greaterThan", 0);
    cy.get("footer .additional-nav a").should("have.length.greaterThan", 0);
    cy.get("footer .social-nav a").should("have.length.greaterThan", 0);
  });
}
