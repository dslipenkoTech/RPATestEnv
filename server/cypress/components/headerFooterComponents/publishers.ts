import { viewport } from "../../environment";

export function branch() {
  it("Branch", () => {
    var urls = [
      ".BranchNav > :nth-child(1) > a > span",
      ".BranchNav > :nth-child(2) > a > span",
      ".BranchNav > :nth-child(3) > a > span",
      ".BranchNav > :nth-child(4) > a > span",
      ".BranchNav > :nth-child(5) > a > span",
    ];
    cy.loopVisible(urls);

    var headings = ["Moody", "Education", "Radio", "Publishers", "Conferences", "Today In The Word"];
    cy.loopCheckText(urls, headings);

    var hrefs = [
      "https://www.moodybible.org",
      "https://www.moody.edu/",
      "https://www.moodyradio.org/",
      "http://moodypublishers.com/",
      "https://www.moodyconferences.com/",
      "https://www.todayintheword.com/",
    ];
    var urls = [
      "body > header > div > ul > li:nth-child(1) > a",
      "body > header > div > ul > li:nth-child(2) > a",
      "body > header > div > ul > li:nth-child(3) > a",
      "body > header > div > ul > li:nth-child(4) > a",
      "body > header > div > ul > li:nth-child(5) > a",
      "body > header > div > ul > li:nth-child(6) > a",
    ];
    cy.loopVerifyHref(urls, hrefs);
  });
}

//^ Header
export function header() {
  it("Header", () => {
    cy.pressEsc();

    //Icon
    cy.visible(".Logo");

    //Search
    const isPhone = true;
    viewport(isPhone);
    if (isPhone) {
      cy.clickElement(".search");
    }
    cy.searchAndVerify(".text", "Books", "#\\#Search", "search/?q=Books");
    cy.pressEsc;

    //Menu
    var urls = [
      ":nth-child(1) > .toggle",
      ":nth-child(2) > .toggle",
      ":nth-child(3) > .toggle",
      ":nth-child(4) > .toggle",
      ":nth-child(5) > .toggle",
    ];

    var list = [
      ":nth-child(1) > .dropdown > .columns",
      ":nth-child(2) > .dropdown > .columns",
      ":nth-child(3) > .dropdown > .columns",
      ":nth-child(4) > .dropdown > .columns",
      ":nth-child(5) > .dropdown > .columns",
    ];
    // For phone extra
    var extraForPhone = [".menu > :nth-child(1) > a", ".menu > :nth-child(2) > a", ".menu > :nth-child(3) > a"];
    if (isPhone) {
      cy.clickElement(".Controls > .menu");
      cy.loopVisible(extraForPhone);
    } else {
      for (let i = 0; i < urls.length; i++) {
        cy.clickElement(urls[i]);
        cy.visible(list[i]);
        cy.clickElement(".closeDrop");
      }
    }
    cy.loopVisible(urls);
  });
}

//^ Footer
export function footer() {
  it.only("Footer", () => {
    //Our websites & blogs
    cy.visible("body > footer > div.Wrap > div:nth-child(1) > p:nth-child(1) > strong:nth-child(1) > strong > b");

    var links = [
      '[title="The 5 Love Languages"]',
      '[title="Start Marriage Right"]',
      "body > footer > div.Wrap > div:nth-child(1) > p:nth-child(1) > strong:nth-child(3) > a",
    ] as string[];
    cy.loopVisible(links);
    cy.loopHrefExists(links);

    //Our authors
    var ourAuthors = "body > footer > div.Wrap > div:nth-child(1) > p:nth-child(2) > a";
    cy.visible(ourAuthors);
    cy.hrefExists(ourAuthors);

    //Connect with us
    cy.visible("body > footer > div.Wrap > div:nth-child(2) > p:nth-child(2)");

    //Social media
    var socialMediaIcons = [
      "body > footer > div.Wrap > div:nth-child(2) > p.socialLinks > a:nth-child(1)",
      "body > footer > div.Wrap > div:nth-child(2) > p.socialLinks > a:nth-child(2)",
      "body > footer > div.Wrap > div:nth-child(2) > p.socialLinks > a:nth-child(3)",
      "body > footer > div.Wrap > div:nth-child(2) > p.socialLinks > a:nth-child(4)",
      "body > footer > div.Wrap > div:nth-child(2) > p.socialLinks > a:nth-child(5)",
      "body > footer > div.Wrap > div:nth-child(2) > p.socialLinks > a:nth-child(6)",
    ];
    cy.loopVisible(socialMediaIcons);
    cy.loopHrefExists(socialMediaIcons);

    //Our mission
    cy.visible(":nth-child(3) > :nth-child(1) > strong");

    //About us
    var urls = [
      "body > footer > div.Wrap > div:nth-child(3) > p:nth-child(2) > a:nth-child(1)",
      "body > footer > div.Wrap > div:nth-child(3) > p:nth-child(2) > a:nth-child(3)",
      "body > footer > div.Wrap > div:nth-child(3) > p:nth-child(2) > a:nth-child(5)",
      "body > footer > div.Wrap > div:nth-child(3) > p:nth-child(2) > a:nth-child(7)",
    ];

    cy.loopVisible(urls);
    cy.loopHrefExists(urls);
    // Bottom section
    const isDesktop = true;
    viewport(!isDesktop);
    if (isDesktop) {
      //Logo
      cy.visible(".logoCol > img");
    }

    //Buttons
    var urls = [
      "body > footer > div.Footer-Sub > div > div.col.linksCol > div > a:nth-child(1)",
      "body > footer > div.Footer-Sub > div > div.col.linksCol > div > a:nth-child(2)",
    ];
    var headings = ["Moody Believes", "Knowing Christ"];
    var hrefs = ["http://www.moodybible.org/beliefs", "http://www.moodybible.org/knowing-christ"];
    cy.loopVisible(urls);
    cy.loopCheckText(urls, headings);
    cy.loopVerifyHref(urls, hrefs);

    //Privacy policy & Terms of use
    var headings = ["Privacy Policy", "Terms of Use"];
    var urls = [
      "body > footer > div.Footer-Sub > div > div.col.linksCol > p > a:nth-child(1)",
      "body > footer > div.Footer-Sub > div > div.col.linksCol > p > a:nth-child(2)",
    ];
    var hrefs = ["/privacy-policy/", "http://www.moodybible.org/terms-of-use"];
    cy.loopVisible(urls);
    cy.loopCheckText(urls, headings);
    cy.loopVerifyHref(urls, hrefs);

    //Copyright
    cy.visible(".copyrightCol");
  });
}
