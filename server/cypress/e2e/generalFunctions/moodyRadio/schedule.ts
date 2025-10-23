import { URLS } from "~cypress/environment";

const link = Cypress.env("Radio") as string;

describe("Testing schedule components", { tags: ["@moody-radio", "@radio", "@premise"] }, () => {
  beforeEach(() => URLS(link));

  it("Testing the schedule button and the load time", () => {
    const startTime = Date.now();

    cy.get(".schedule")
      .should("be.visible")
      .within(() => {
        cy.get("a").should("be.visible").and("have.attr", "href").and("not.be.empty");
      })
      .click();

    // Assert that the page loads within 10 seconds
    cy.then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(10000);
    });
  });

  it.only("Testing the schedule page", () => {
    cy.get(".schedule").click();

    /*
    h1, description, buttons
    */
    // Test the main container
    cy.get(".Dropzone-full").should("be.visible");

    // Test the main heading
    cy.get(".Body > :nth-child(1) > h1").should("be.visible").should("have.text", "Moody Radio Schedule");

    // Test the description text
    cy.get("div").contains("Moody Radio's new program schedule is now available.").should("be.visible");

    // Test the buttons container and individual buttons
    cy.get("div").contains("Moody Radio Network").parent();

    // Test each primary button
    cy.get("a.primary-button").should("have.length", 3);

    // Test Moody Radio Network button
    cy.get("a.primary-button")
      .contains("Moody Radio Network")
      .should("be.visible")
      .should("have.attr", "href")
      .and("include", "/schedule/?station=mdrn");

    // Test Moody Radio Northwest button
    cy.get("a.primary-button").contains("Moody Radio Northwest").should("be.visible").should("have.attr", "href").and("not.be.empty");

    // Test Download Program Schedules button
    cy.get("a.primary-button").contains("Download Program Schedules").should("be.visible").should("have.attr", "href").and("not.be.empty");

    /* 
    Weekday Schedule Navigation
    */
    // Test the weekday schedule navigation
    cy.get("ul.Schedule-weekday").should("be.visible");

    // Test that all 7 days are present
    cy.get("ul.Schedule-weekday li").should("have.length", 7);

    // Test each day link individually
    const days = [
      { short: "Sun", full: "Sunday", day: "0" },
      { short: "Mon", full: "Monday", day: "1" },
      { short: "Tue", full: "Tuesday", day: "2" },
      { short: "Wed", full: "Wednesday", day: "3" },
      { short: "Thu", full: "Thursday", day: "4" },
      { short: "Fri", full: "Friday", day: "5" },
      { short: "Sat", full: "Saturday", day: "6" },
    ];

    days.forEach((day, index) => {
      cy.get("ul.Schedule-weekday li")
        .eq(index)
        .within(() => {
          cy.get("a")
            .should("be.visible")
            .should("have.attr", "data-short", day.short)
            .should("have.attr", "href")
            .and("include", `station=mdrn`)
            .and("include", `day=${day.day}`);

          cy.get("a span").should("contain.text", day.full);
        });
    });

    // Test that one day has the isActive class (typically current day)
    cy.get("ul.Schedule-weekday li a.isActive").should("exist");

    // Test that only one day is active
    cy.get("ul.Schedule-weekday li a.isActive").should("have.length", 1);

    /*
     Schedule Table
     */
    // Test the schedule table container
    cy.get("ul.Schedule-day").should("be.visible");

    // Test that schedule items exist (should have multiple programs)
    cy.get("ul.Schedule-day li").should("have.length.greaterThan", 10);

    // Test the structure of schedule items
    cy.get("ul.Schedule-day li")
      .first()
      .within(() => {
        // Test time section structure
        cy.get("div.time").should("be.visible");
        cy.get("div.time h2").should("be.visible").and("not.be.empty");
        cy.get("div.time h3").should("be.visible").and("not.be.empty");

        // Test content section structure
        cy.get("div.content").should("be.visible");
        cy.get("div.content h2").should("be.visible");
        cy.get("div.content h2 a").should("be.visible").and("have.attr", "href").and("not.be.empty");
        cy.get("div.content p").should("be.visible");
        cy.get("div.content p img").should("be.visible").and("have.attr", "src").and("not.be.empty");
      });

    // Test that all schedule items have the required structure
    cy.get("ul.Schedule-day li").each(($el) => {
      cy.wrap($el).within(() => {
        // Each item should have time and content divs
        cy.get("div.time").should("exist");
        cy.get("div.content").should("exist");

        // Time section should have start and end times
        cy.get("div.time h2").should("exist");
        cy.get("div.time h3").should("exist");

        // Content section should have program link and image
        cy.get("div.content h2 a").should("exist").and("have.attr", "href");
        cy.get("div.content p img").should("exist").and("have.attr", "src");
      });
    });
  });
});
