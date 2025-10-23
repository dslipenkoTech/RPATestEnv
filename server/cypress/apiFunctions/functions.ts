import { util, validate } from "./functions.util";
import "cypress-if";
import moment from "moment-timezone";

export function compareSelectors(frontEndSelector: string, apiPath: string, attribute = "innerHTML") {
  if (util.stringNullCheck(apiPath) === "no text") return;

  let errorMessage = `'${frontEndSelector}' selector wasn't found on the page.\n\n API: '${apiPath}'.`;
  let message = `'${frontEndSelector}' - '${apiPath}'`;

  cy.customGet(frontEndSelector, message, errorMessage).then((el) => {
    let attributeValue = util.attributeCheck(el, attribute);
    const innerHTML = util.decode(util.stringNullCheck(attributeValue));
    const selector = util.decode(util.stringNullCheck(apiPath));
    util.compare(innerHTML, selector);
  });
}

export function compareSelectorsUrl(
  frontEndSelector: string,
  apiPath: string,
  attribute = "href",
  removeQueryStringImg = false,
  removeWrapper = false
) {
  let errorMessage = `'${frontEndSelector}' selector URL wasn't found on the page.\n The API Input is '${apiPath}'.`;
  let message = `'${frontEndSelector}' - '${apiPath}'`;

  cy.customGet(frontEndSelector, message, errorMessage, true)
    .invoke("attr", attribute)
    .then((attrValue: string | undefined) => {
      if (removeQueryStringImg && attrValue) {
        if (removeWrapper) {
          let selector = util.normilizeUrl(util.removeQueryString(attrValue)).replace(`url('`, "");
          let content = util.removeQueryString(apiPath).replace(`url('`, "");
          util.compare(selector, content);
        } else {
          let selector = util.normilizeUrl(util.removeQueryString(attrValue));
          let content = util.removeQueryString(apiPath);
          util.compare(selector, content);
        }
      } else {
        const normalizedValue = util.normilizeUrl(util.stringNullCheck(attrValue?.toString() || "") as string);
        util.compare(normalizedValue, apiPath.toString());
      }
    });
}

export function pushApiContentModel(container: any, element: any, singular = false) {
  if (singular) {
    container.push(element);
  } else {
    try {
      element.forEach((selector: any) => container.push(selector.model));
    } catch (error: any) {
      if (error?.message === "Cannot read properties of undefined (reading 'forEach')") throw new Error("No blockTypes found to test");
      throw new Error(`Error pushing api content model: ${error}`);
    }
  }
  return container;
}

export function currentUrlTest(url: string) {
  cy.url().then((currentUrl) => expect(util.removeQueryString(currentUrl)).to.equal(url));
}

export function frontEndBtnUrlTest(selector: string, href: string, functionName = "") {
  cy.log(`_${functionName} > frontEndBtnUrlTest_`);
  cy.get(selector).click();
  cy.wait(2000).then(() => {
    cy.url().then((url) => expect(url).to.include(href));
  });
  cy.go("back").then(() => cy.wait(2000));
}

export function getVariableFromUrl() {
  return cy.url().then((currentUrl) => {
    if (currentUrl.includes("moodybible")) {
      return "MBI";
    } else if (currentUrl.includes("todayintheword")) {
      return "TITW";
    } else if (currentUrl.includes("moody.edu")) {
      return "Edu";
    } else {
      return "Unknown";
    }
  });
}

export function pagination(selector: string, elPerPage: number, elementName: string, index: number, content: any, functionName: string) {
  if (elPerPage === 1) {
    if (index < content.length - 1) {
      cy.get(selector).click();
    }
    return;
  }
  // Example: pagination(selector, 3, "Next Button", j, content.cards, functionName);
  if ((index + 1) % elPerPage === 0 && index < content.length - 1) {
    // Check if "Next" button is visible and click it. CustomGet is used to throw an error if the button is not found.
    cy.log(`Clicking _${functionName} > ${elementName}_`);
    cy.customGet(selector, `Clicking ${elementName}`, `${elementName} not found in ${functionName}`).should("be.visible").click();
  }
}

export function formatDate(date: string, type: string) {
  if (!date) return null;
  if (type) return moment(date).format(type);
  else return moment(date).format("M/D/YYYY");
}

export const viewPort = {
  reset() {
    cy.viewport(Cypress.config("viewportWidth"), Cypress.config("viewportHeight"));
  },
  phone() {
    return cy.viewport("iphone-6");
  },
};

export function validateSelectors(objects: any, functionName = "") {
  Object.entries(objects).forEach(([name, el]: [string, any]) => {
    if (el.content && (Boolean(el.condition) === true || el.condition === undefined)) {
      validate.resolveSelector(el.selector).then((resolvedSelector: string) => {
        cy.log(`_${functionName} > ${name}_ is expected to pass`);
        if (name.includes("Url")) {
          if (el.function) {
            validate.passingOutcomes({ ...el, selector: resolvedSelector }, true);
          } else {
            if (el.attribute) {
              if (el.removeQueryString) {
                if (el.removeWrapper) {
                  compareSelectorsUrl(resolvedSelector, el.content, el.attribute, true, true);
                } else {
                  compareSelectorsUrl(resolvedSelector, el.content, el.attribute, true);
                }
              } else {
                compareSelectorsUrl(resolvedSelector, el.content, el.attribute);
              }
            } else {
              if (el.removeQueryString) {
                compareSelectorsUrl(resolvedSelector, el.content, "href", true);
              } else {
                compareSelectorsUrl(resolvedSelector, el.content);
              }
            }
          }
        } else {
          if (el.function) {
            validate.passingOutcomes({ ...el, selector: resolvedSelector });
          } else {
            if (el.attribute) {
              compareSelectors(resolvedSelector, el.content, el.attribute);
            } else {
              compareSelectors(resolvedSelector, el.content);
            }
          }
        }
      });
    } else {
      validate.resolveSelector(el.selector).then((resolvedSelector) => {
        cy.log(`_${functionName} > ${name}_ expected to fail`);
        if (el.fail) {
          if (name.includes("Url")) {
            validate.failingOutcomes({ ...el, selector: resolvedSelector }, true);
          } else {
            validate.failingOutcomes({ ...el, selector: resolvedSelector });
          }
        } else {
          cy.get(resolvedSelector).should("not.exist");
        }
      });
    }
  });
}
