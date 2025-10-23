// beforeEach(function () {
//   let testSuite = Cypress.env("SUITE");
//   if (!testSuite) {
//     return;
//   }

//   const testName = Cypress.mocha.getRunner().test.fullTitle();
//   testSuite = "<" + testSuite + ">";
//   if (!testName.includes(testSuite)) {
//     this.skip();
//   }
// });

// Import commands.js using ES2015 syntax:
import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      checkText(selector: string, expectedText: string): Chainable<JQuery<HTMLElement>>;
      loopCheckText(selectors: string[], expectedTexts: string[]): Chainable<JQuery<HTMLElement>>;
      pressEsc(): Chainable<JQuery<HTMLElement>>;
      visible(el: string): Chainable<JQuery<HTMLElement>>;
      loopVisible(elements: string[]): Chainable<JQuery<HTMLElement>>;
      verifyLinkAndReturn(link: string, expectedUrlPart: string): Chainable<JQuery<HTMLElement>>;
      loopVerifyLinkAndReturn(links: string[], expectedUrls: string[]): Chainable<JQuery<HTMLElement>>;
      verifyHref(linkSelector: string, expectedUrl: string): Chainable<JQuery<HTMLElement>>;
      loopVerifyHref(links: string[], expectedUrls: string[]): Chainable<JQuery<HTMLElement>>;
      hrefExists(link: string): Chainable<JQuery<HTMLElement>>;
      loopHrefExists(links: string[]): Chainable<JQuery<HTMLElement>>;
      searchAndVerify(
        inputSelector: string,
        searchText: string,
        buttonSelector: string,
        expectedUrlPart: string
      ): Chainable<JQuery<HTMLElement>>;
      verifyAttributeValue(selector: string, attribute: string, value: string): Chainable<JQuery<HTMLElement>>;
      verifyMetaContent(attribute: string, property: string, expectedContent: string): Chainable<JQuery<HTMLElement>>;
      verifyClass(selector: string, className: string): Chainable<JQuery<HTMLElement>>;
      clickElement(selector: string): Chainable<JQuery<HTMLElement>>;
      loopClickEl(selectors: string[]): Chainable<JQuery<HTMLElement>>;
      realClick(selector: string, options?: Partial<MouseEventOptions>): Chainable<JQuery<HTMLElement>>;
      realHover(el: string, options?: Partial<MouseEventOptions>): Chainable<JQuery<HTMLElement>>;
      textExists(text: string): Chainable<JQuery<HTMLElement>>;
      threeCheck(elements: string[], hrefs: string[], headings: string[]): Chainable<JQuery<HTMLElement>>;
      expectPlayingMedia(): Chainable<JQuery<HTMLElement>>;
      checkCssValue(selector: string, property: string, value: string): Chainable<JQuery<HTMLElement>>;
      getPath(): Chainable<string>;
      customGet(selector: string, message: string, errorMessage: string, visible?: boolean): Chainable<JQuery<HTMLElement>>;
    }

    interface MouseEventOptions {
      position?: string;
      button?: string;
      scrollBehavior?: string;
      x?: number;
      y?: number;
    }
  }
}
