export function normalizeEnvironment(environment: string) {
  let environmentToUse = environment;
  if (environment === "int") environmentToUse = "integration";
  else if (environment === "pre") environmentToUse = "pre-production";
  else if (environment === "prod" || environment === "production") environmentToUse = "production";
  else if (["integration", "pre-production", "production"].includes(environment)) environmentToUse = environment;
  else throw new Error("Invalid environment");
  return environmentToUse as "integration" | "pre-production" | "production";
}

// For API URLs (like api.ts)
export function getApiEnvironment(environment: string): "int" | "pre" | "www" {
  const normalized = normalizeEnvironment(environment);

  if (normalized === "integration") return "int";
  else if (normalized === "pre-production") return "pre";
  else if (normalized === "production") return "www";

  throw new Error(`Invalid environment for API mapping: ${environment}`);
}

// For Cypress URLs (like cypress-spec.ts)
export function getUrlEnvironment(environment: string): "qa" | "stage" | "www" {
  const normalized = normalizeEnvironment(environment);

  if (normalized === "integration") return "qa";
  else if (normalized === "pre-production") return "stage";
  else if (normalized === "production") return "www";

  throw new Error(`Invalid environment for URL mapping: ${environment}`);
}
