import { validateSelectors } from "../functions";

export function eduContactInformationBlock(url: string, content: any, i: number) {
  cy.log("[EduContactInformationBlock]()");
  const functionName = "eduContactInformationBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div > div:nth-child(1) > h2`,
        content: content.heading,
      },
      subheading: {
        selector: `section:nth-child(${i}) > div > div:nth-child(1) > div.subheading-class`,
        content: content.subheading,
      },
    };
    validateSelectors(main, functionName);

    console.log(content.contacts);
    // Contacts
    content.contacts?.forEach((contact: any, y: number) => {
      const contactBlock = {
        name: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > div:nth-child(${
            y + 1
          }) > div:nth-child(1) > div.text-sm.font-medium`,
          content: contact.name,
        },
        title: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > div:nth-child(${
            y + 1
          }) > div:nth-child(1) > div.text-sm.font-normal`,
          content: contact.title,
        },
        emailText: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > div:nth-child(${
            y + 1
          }) > div:nth-child(2) > a:nth-child(1) > span:nth-child(2)`,
          content: contact.email?.text,
          fail: "skip",
        },
        emailUrl: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > div:nth-child(${y + 1}) > div:nth-child(2) > a:nth-child(1)`,
          content: contact.email?.href,
          fail: "skip",
        },
        phoneText: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > div:nth-child(${y + 1}) > div:nth-child(2) > a:nth-child(${
            contact.email ? 2 : 1
          }) > span:nth-child(2)`,
          content: contact.phone?.text,
        },
        phoneUrl: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > div:nth-child(${y + 1}) > div:nth-child(2) > a:nth-child(${
            contact.email ? 2 : 1
          })`,
          content: contact.phone?.href,
        },
      };
      validateSelectors(contactBlock, functionName);
    });
  });
}
