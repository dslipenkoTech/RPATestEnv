import he from "he";
import "cypress-if";
import { compareSelectors, getVariableFromUrl } from "./functions";

export const util = {
  decode(path: string | number) {
    let element = he.decode(path.toString().replace(/<[^>]*>/g, ""));
    return element;
  },
  stringNullCheck(string: string | number) {
    if (string === null || string === 0 || string === undefined || string === "" || string === "/#") {
      return "no text";
    } else {
      return string;
    }
  },
  compare(a: string | number, b: string | number) {
    const functionName = "MBIhomePageHeroBlock";
    const selector = "header";
    const valueA = this.stringNullCheck(a).toString().trim();
    const valueB = this.stringNullCheck(b).toString().trim();
    expect(valueA).to.equal(valueB, `${functionName} > ${selector} \n\n "${a}" is a selector value\n "${b}" is a API value \n\n`);
  },
  attributeCheck(el: any, attribute: string) {
    if (attribute === "innerHTML") {
      return el[0].innerHTML;
    } else if (attribute === "text") {
      return el.text();
    } else {
      return el.attr(attribute);
    }
  },
  normilizeUrl(url: string) {
    if (url === "/") {
      cy.url().then((currentUrl) => {
        return currentUrl;
      });
    }
    return url;
  },
  removeQueryString(url: string) {
    const urlObj = new URL(url, "http://example.com");
    return urlObj.pathname;
  },
};

export const validate = {
  passingOutcomes(el: any, url = false) {
    if (url) {
      if (el.function.includes("include")) {
        cy.get(el.selector).should("have.attr", el.attribute).and("include", el.content);
      } else {
        throw new Error(`Function ${el.function} is not supported for URL validation`);
      }
    } else {
      if (el.function.includes("exist")) {
        cy.get(el.selector).should("exist");
      } else if (el.function.includes("visible")) {
        cy.visible(el.selector);
      } else {
        compareSelectors(el.selector, el.content);
      }
    }
  },
  failingOutcomes(el: any, url = false) {
    if (url) {
      if (el.fail.includes("emptyAttribute")) {
        cy.get(el.selector).then(($el) => {
          expect($el.attr(el.attribute)).to.be.oneOf([undefined, null, "", "/#"]);
        });
      } else if (el.fail.includes("noHref")) {
        cy.get(el.selector).should("not.have.attr", "href");
      }
    } else {
      if (el.fail.includes("noText")) {
        cy.get(el)
          .invoke("text")
          .then((text) => {
            const trimmedText = text.trim();
            if (trimmedText === "") {
              cy.log(`${el.selector} is empty`);
            } else {
              throw new Error(`${el.selector} has unexpected text: "${trimmedText}"`);
            }
          });
      } else if (el.fail.includes("notVisible")) {
        cy.get(el.selector, { timeout: 0 }).if("exist").should("not.be.visible").else().should("not.exist");
      } else if (el.fail.includes("skip")) {
        return;
      }
    }
  },
  resolveSelector(selector: any) {
    // Helper function to handle selectors that may have MBI/TITW variations
    if (typeof selector === "object" && (selector.MBI || selector.TITW || selector.EDU)) {
      return getVariableFromUrl().then((site) => {
        if (!selector[site]) {
          throw new Error(`No selector defined for site: ${site}`);
        }
        return selector[site];
      });
    }
    return cy.wrap(selector);
  },
};
