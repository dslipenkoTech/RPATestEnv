import "./commands";
import "cypress-if";
// Examples:
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

//Testing a Text Element --finished--
Cypress.Commands.add("checkText", (selector, expectedText) => {
  cy.get(selector).then((el) => {
    expect(el.text()).to.eq(expectedText);
  });
});

//Testing Multiple Text Elements --finished--
Cypress.Commands.add("loopCheckText", (selectors, expectedTexts) => {
  selectors.forEach((selector, index) => {
    cy.get(selector).then((el) => {
      expect(el.text()).to.eq(expectedTexts[index]);
    });
  });
});

//Press Escape Key --finished--
Cypress.Commands.add("pressEsc", () => {
  cy.get("body").type("{esc}");
});

//Verify that the element is visible on the page --finished--
Cypress.Commands.add("visible", (el) => {
  cy.get(el).should("be.visible");
});

//Loop checking either the element is visible or not --finished--
Cypress.Commands.add("loopVisible", (elements: string[]) => {
  elements.forEach((el, i) => {
    cy.get(el).should("be.visible");
    if (i < elements.length - 1) {
      cy.wait(2000);
    }
  });
});

//Click on a url and very the link --finished--
Cypress.Commands.add("verifyLinkAndReturn", (link, expectedUrlPart) => {
  cy.get(link)
    .click()
    .then(() => {
      cy.url().should("include", expectedUrlPart);
      cy.wait(10000);
      cy.go("back");
    });
});

//Loop click on a url and very the link --finished--
Cypress.Commands.add("loopVerifyLinkAndReturn", (links, expectedUrls) => {
  links.forEach((link, index) => {
    cy.get(link)
      .click()
      .then(() => {
        cy.url().should("include", expectedUrls[index]);
        cy.go("back");
      });
  });
});

//Verifies href attribute --finished--
Cypress.Commands.add("verifyHref", (linkSelector, expectedUrl) => {
  cy.get(linkSelector).should("have.attr", "href").and("include", expectedUrl);
});

//Loop verify href attribute --finished--
Cypress.Commands.add("loopVerifyHref", (links, expectedUrls) => {
  links.forEach((link, index) => {
    cy.get(link).should("have.attr", "href").and("include", expectedUrls[index]);
  });
});

//Checks if href exists --finished--
Cypress.Commands.add("hrefExists", (link) => {
  cy.get(link).should("not.have.attr", "href", "#undefined");
});

//Loop check if href exists --finished--
Cypress.Commands.add("loopHrefExists", (links) => {
  links.forEach((link) => {
    cy.get(link).should("not.have.attr", "href", "#undefined");
  });
});

//Testing Search input and verifies the outcome --finished--
Cypress.Commands.add("searchAndVerify", (inputSelector, searchText, buttonSelector, expectedUrlPart) => {
  cy.get(inputSelector).type(searchText);
  cy.get(inputSelector).should("have.value", searchText);

  //Click "search" button
  cy.get(buttonSelector).click();
  cy.url().should("include", expectedUrlPart);
  cy.go("back");
});

//Verify Attribute value --finished--
Cypress.Commands.add("verifyAttributeValue", (selector, attribute, value) => {
  cy.get(selector).should("have.attr", attribute).and("include", value);
});

//Verify meta tags on the page --finished--
Cypress.Commands.add("verifyMetaContent", (attribute, property, expectedContent) => {
  cy.get(`head meta[${attribute}="${property}"]`).should("have.attr", "content", expectedContent);
});

//Verify Class
Cypress.Commands.add("verifyClass", (selector, className) => {
  cy.get(selector).should("have.class", className);
});

//Click on the element--finished--
Cypress.Commands.add("clickElement", (selector) => {
  cy.get(selector).click();
});

//Loop click on the element --finished
Cypress.Commands.add("loopClickEl", (selectors) => {
  selectors.forEach((selector) => {
    cy.get(selector).click();
  });
});

//Text Exists on the page --finished--
Cypress.Commands.add("textExists", (text) => {
  cy.contains(text).should("exist");
});

// visible, headings, hrefs --finished--
Cypress.Commands.add("threeCheck", (elements, hrefs, headings) => {
  // Visibility Check
  elements.forEach((selector) => {
    cy.get(selector).should("be.visible");
    cy.wait(1000);
  });

  // Hrefs Check
  elements.forEach((selector, index) => {
    cy.get(selector).should("have.attr", "href").and("include", hrefs[index]);
  });

  // Headings Check
  elements.forEach((selector, index) => {
    cy.get(selector).should((el) => {
      expect(el.text()).to.eq(headings[index]);
    });
  });
});

//Check if audio is playing or not --finished--
Cypress.Commands.add("expectPlayingMedia", () => {
  cy.get("audio, video").should((els) => {
    let isPlaying = false;
    els.each((_, el) => {
      const mediaEl = el as unknown as HTMLMediaElement;
      console.log(mediaEl);
      console.log(mediaEl.duration, mediaEl.paused, mediaEl.muted);
      if (mediaEl.duration > 0 && !mediaEl.paused && !mediaEl.muted) {
        isPlaying = true;
        console.log(isPlaying);
      }
      expect(mediaEl.duration > 0 && !mediaEl.paused && !mediaEl.muted).to.eq(false);
    });
  });
});

//Css check value
Cypress.Commands.add("checkCssValue", (selector, property, value) => {
  cy.get(selector).should("have.css", property, value);
});

// Utility to get full CSS path
Cypress.Commands.add("getPath", { prevSubject: "element" as any }, (element) => {
  let path = "";
  while (element.length) {
    let tagName = element.prop("tagName").toLowerCase();
    let index = element.index() + 1;
    path = `${tagName}:nth-child(${index}) > ` + path;
    element = element.parent();
  }
  path = path.slice(0, -3); // Remove the last ' > '
  return cy.wrap(path);
});

// Custom error message
Cypress.Commands.add("customGet", (selector, message, errorMessage, visible = false) => {
  cy.get(selector)
    .if()
    .then(() => {
      cy.log(message);
      visible && cy.get(selector).should("be.visible");
    })
    .else()
    .then(() => {
      throw new Error(errorMessage);
    })
    .finally();

  return cy.get(selector);
});
