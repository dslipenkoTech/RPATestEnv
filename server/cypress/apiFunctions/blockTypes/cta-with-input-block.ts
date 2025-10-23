import { getVariableFromUrl, validateSelectors } from "../functions";
import { formContainerBlock } from "./form-container-block";

export function ctaWithInputBlock(
  url: string,
  content: any,
  i: number,
  pageTypeObject: any,
  skipVisit = false,
  parentFunction: any,
  j: number,
  k: number
) {
  cy.log("[CtaWithInputBlock]()");
  const functionName = "ctaWithInputBlock";

  if (!skipVisit) cy.visit(url);
  cy.then(() => {
    getVariableFromUrl().then((env) => {
      const formInformation = {
        heading: {
          selector: `section.${env}.cta-input-block > div > div:nth-child(1) > div > h2`,
          content: content.headline,
        },
        description: {
          selector: `section.${env}.cta-input-block > div > div:nth-child(1) > div > p`,
          content: content.description,
          fail: "notVisible",
        },
        icon: {
          selector: `section.${env}.cta-input-block > div > div:nth-child(1) > div > div`,
          content: content.icon,
          function: "exist",
        },
      };
      validateSelectors(formInformation, functionName);

      //^ Forms
      if (content.form) {
        let formType = content.form.contentType.slice(-1)[0];
        switch (formType) {
          case "FormContainerBlock":
            formContainerBlock(null, content);
            break;
          default:
            throw new Error(`CtaWithInputBlock(${i}) | ${formType} isn't supported or doesn't exist`);
        }
      } else {
        throw new Error(`CtaWithInputBlock(${i}) doesn't have a form`);
      }
    });
  });
}
