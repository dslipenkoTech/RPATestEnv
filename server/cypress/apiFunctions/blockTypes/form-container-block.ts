function extractFormMetadata(html: string) {
  // Parse HTML directly since the form data is embedded in HTML elements
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const fields: any[] = [];
  const buttons: any[] = [];

  // Extract input fields - focus on user-facing inputs
  const inputs = doc.querySelectorAll("input");
  inputs.forEach((input) => {
    const element = input as HTMLInputElement;
    const fieldName = element.getAttribute("data-f-element-name") || element.getAttribute("name") || "";
    const fieldId = element.getAttribute("id") || "";
    const fieldType = element.getAttribute("type") || "";
    const dataType = element.getAttribute("data-f-type") || fieldType;
    const required = element.hasAttribute("required") || element.hasAttribute("aria-required");
    const hasDataInput = element.hasAttribute("data-f-datainput");

    // Try to find associated label
    let label = "";
    const labelElement = doc.querySelector(`label[for="${fieldId}"]`);
    if (labelElement) {
      label = labelElement.textContent?.trim() || "";
    }

    // Determine if this is a user-facing field vs system field
    const isSystemField = fieldType === "hidden" || fieldName.includes("Form__Element.Form__Syst") || !hasDataInput;

    // Only include fields that have IDs
    if (fieldId) {
      fields.push({
        id: fieldId,
        name: fieldName,
        label: label || fieldName,
        type: dataType,
        inputType: fieldType,
        required: required,
        isSystemField: isSystemField,
        isUserField: !isSystemField,
        selector: `#${fieldId}`,
        hasDataInput: hasDataInput,
        value: isSystemField ? element.getAttribute("value") : undefined,
      });
    }
  });

  // Extract other form elements like checkboxes, selects, textareas
  const otherInputs = doc.querySelectorAll(
    'textarea[data-f-element-name], select[data-f-element-name], input[type="checkbox"][data-f-element-name], input[type="radio"][data-f-element-name]'
  );
  otherInputs.forEach((input) => {
    const element = input as HTMLInputElement;
    const fieldName = element.getAttribute("data-f-element-name") || element.getAttribute("name") || "";
    const fieldId = element.getAttribute("id") || "";
    const fieldType = element.tagName.toLowerCase();
    const dataType = element.getAttribute("data-f-type") || fieldType;
    const required = element.hasAttribute("required") || element.hasAttribute("aria-required");

    // Try to find associated label
    let label = "";
    const labelElement = doc.querySelector(`label[for="${fieldId}"]`);
    if (labelElement) {
      label = labelElement.textContent?.trim() || "";
    }

    fields.push({
      id: fieldId,
      name: fieldName,
      label: label || fieldName,
      type: dataType,
      inputType: fieldType,
      required: required,
      isSystemField: false,
    });
  });

  // Extract submit buttons
  const submitButtons = doc.querySelectorAll('button[data-f-type="submitbutton"], input[type="submit"]');
  submitButtons.forEach((el) => {
    buttons.push({
      id: el.getAttribute("id"),
      name: el.getAttribute("name"),
      label: el.textContent?.trim() || el.getAttribute("value") || "Submit",
      type: "submit",
    });
  });

  // Try to extract form ID from various possible sources
  const formElement = doc.querySelector("form");
  const formId = formElement?.getAttribute("id") || formElement?.getAttribute("data-form-id") || "extracted-form";

  return {
    formId,
    fields: fields.filter((f) => f.name),
    buttons,
  };
}

export function formContainerBlock(url: string | null, content: any) {
  cy.log("[FormContainerBlock]()");

  const rawData = content.formModelRawData || content.form?.formModelRawData;

  cy.writeFile("./form-response.html", rawData);

  // Read the HTML file and extract metadata
  cy.readFile("./form-response.html")
    .then((html: string) => {
      const metadata = extractFormMetadata(html);

      // Save the extracted metadata
      cy.writeFile("./form-structure.json", JSON.stringify(metadata, null, 2));

      // Clean up form ID - remove quotes and escape characters
      const formId = metadata.formId
        .replace(/^["'\\]*|["'\\]*$/g, "")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'");

      cy.get(`#${formId} input`)
        .filter((_idx, el) => Object.getOwnPropertyNames(el).some((prop) => prop.startsWith("jQuery")))
        .each(($el) => {
          // Check if the element is visible before trying to type
          cy.wrap($el).then(($element) => {
            if ($element.is(":visible")) {
              cy.wrap($element).type("test");
            } else {
            }
          });
        });
    })
    .then(() => {
      // Check that submit button(s) exist on the page
      cy.readFile("./form-structure.json").then((metadata: any) => {
        if (metadata.buttons && metadata.buttons.length > 0) {
          metadata.buttons.forEach((button: any) => {
            if (button.type === "submit") {
              if (button.id) {
                cy.get(`#${button.id}`).should("exist");
              } else {
                // Fallback to generic submit button selector if no ID
                cy.get('button[data-f-type="submitbutton"], input[type="submit"]').should("exist");
              }
            }
          });
        } else {
          // Fallback check if no buttons in metadata
          cy.get('button[data-f-type="submitbutton"], input[type="submit"]').should("exist");
        }
      });
    })
    .then(() => {
      // Remove both files completely after use
      cy.exec("rm -f ./form-response.html ./form-structure.json");
    });
}
