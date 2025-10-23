# File Formats

## DXP Test File Format

<!-- prettier-ignore -->
const test = {
    name: `PageType | Description Of The Test Suite`,          // A descriptive name for the test suite
    testCases: [                                               
        [testCaseId, "Detailed description of the test case"], // A test case with a description
        [testCaseId2, "Brief description", {skip: true}],      // A test case marked to be skipped
        testCaseId3,                                           // A test case without a description
    ],
    skip: true,                                                // Set to 'true' to skip the entire test unit
};
cypressBlockTesting(test);

## Block Testing File Format

<!-- prettier-ignore -->
1. const element = {
    title: {
      selector: `selector of the front end element that you want to test`,
      content: api.path?.to?.content
    },
    // If you want to test href or src attributes of the element you need to add `Url` to the name of the element
    cardUrl: {
      selector: `selector`,
      content: api.path?.to?.content
      attribute: `src` // default is `href`
    },
    ...
  }
validateSelectors(element)

// You can use additional functions to validate the element

<!-- prettier-ignore -->
2. const element ={
    title: {
      selector: `selector`,
      content: api.path?.to?.content,
      fail: `noText`, `notVisible`, `skip` // skip skipped an elemnent if it doesn't exist,
      function: `visible`, // You can use other function to test the element. Default is "exist",
      attribute: `innerHTML` // You can use other attribute to test the element. Default is "text",
    },
    cardUrl: {
      selector: `selector`,
      content: api.path?.to?.content,
      attribute: `src`,
      removeQueryString: true, // default is false
      removeWrapper: true // default is false
      fail: `emptyAttribute`, `noHref`, `skip` // Determines the expected failure outcome. For example "noHref" is ensuring the test does not include an href if the element does not exist.
    },
    ...
  }
validateSelectors(element)

// You can also test different selectors on TITW and Moody

<!-- prettier-ignore -->
3. const element = {
    title: {
      selector: {
        TITW: `selector`,
        Moody: `selector`
      },
    content: api.path?.to?.content
    },
    ...
  }
validateSelectors(element)

## Json File with allowed selectors

- Test will fail if the page has a selector that is not in the json file.
- Each object consists of `pageType`, `environment` and `blocks`.
- Some pages have test exceptions. If a page has a test exception (e.g., `"testException": "testFullPage"`), it means that the page will not be split into blocks and the body of the page received from the API will be tested as a whole.

# Dependencies

RPA Testing using:

- Node.js
- Cypress.io
- Cypress Pro
- Cypress-if
- Cypress-real-events
- Cypress-wait-until

## Cypress-if

Description: Custom Error Message

- It uses a conditional check ("custom-if", an external cypress plugin) only with purposes of troubleshooting and debugging and doesn't affect the test results.
- Cypress team considers conditional testing an anti-pattern
- Usage example:
  - `cy.customGet(selector, message, errorMessage, consoleOptions = { consoleLog: "", consoleError: "" })`

# Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes.
4. Push your branch: `git push origin feature-name`.
5. Create a pull request.
