let envType: string = Cypress.env("ENV_TYPE");

if (envType === "integration" || envType === "int") envType = "qa";
else if (envType === "pre-production" || envType === "pre") envType = "stage";
else if (envType === "production" || envType === "prod") envType = "www";
else throw new Error(`Invalid environment ${envType}`);

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

export function URLS(link: string) {
  const url = `https://${envType}.${link}`;
  cy.visit(url);

  if (link == "moodybible.org/") {
    cy.origin("https://give.moody.edu", { args: { envType } }, ({ envType }) => {
      cy.visit(
        `https://${envType}.moodybible.org/?_gl=1*1t60eba*_gcl_au*NzUyODMyOTI4LjE3MzU2ODY4OTc.*_ga*MjY1MzA5MDI3LjE3MzU2ODY4OTc.*_ga_5KBWNB7QS5*MTczNTY4Njg5Ny4xLjEuMTczNTY4Njk5OS41OS4wLjA.*_ga_4WH1937046*MTczNTY4Njg5Ny4xLjEuMTczNTY4Njk5OS41OS4wLjA.*_ga_YG53ZQSBCG*MTczNTY4Njg5Ny4xLjEuMTczNTY4Njk5OS41OS4wLjA.`
      );
    });
  } else if (link == "moodyradio.org/") {
    cy.visit(`https://${envType}.${link}?utm_source=moodyradio.org&utm_medium=referral&utm_campaign=moodyradio.org`);
  }
}

// Phone viewport
export function viewport(phone: boolean) {
  if (phone) cy.viewport(375, 812);
  else return;
}
