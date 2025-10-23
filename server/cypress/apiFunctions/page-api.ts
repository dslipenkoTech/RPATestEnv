// Main API request function - simplified and more focused
export function apiRequest(pageId: number, clearCache = false) {
  if (!pageId) throw new Error("Page id is missing or invalid");
  if (clearCache) cy.clearLocalStorage().clearCookies();

  return cy
    .request({
      method: "GET",
      url: buildApiUrl(pageId),
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200) throw new Error(`Error fetching page ${pageId}: Status ${response.status}`);

      // If page data exists, return response directly
      if (response.body.page) return response;

      // Otherwise, make direct API call and validate
      return directApiCall(response.body.url).then((fullResponse) => {
        if (fullResponse.body.page === null) throw new Error("Page is null after direct API call");
        return fullResponse;
      });
    });
}

// Helper function to construct API URL
function buildApiUrl(pageId: number): string {
  const baseApiUrl = Cypress.env("API_BASE_URL");
  if (!baseApiUrl) throw new Error(`API_BASE_URL is missing | Issue with Cypress.env file - ${baseApiUrl}`);

  const envType = normalizeEnvironment(Cypress.env("ENV_TYPE"));
  return `https://${envType}.${baseApiUrl}${pageId}`;
}

// Making a direct API when the page doesn't have page content
export function directApiCall(url: string) {
  return cy
    .request({
      method: "GET",
      url,
      headers: { Accept: "application/json", "x-custom-content-api": "on" },
      failOnStatusCode: false,
    })
    .then((response) => ({ ...response, body: JSON.parse(response.body) }));
}

// Verifying the page status is 200
export function pageStatus(content: any) {
  return cy.request({ url: content.body.url, failOnStatusCode: false }).then((response) => {
    expect(response.status, "Page status is not 200").to.eq(200);
    return response.status;
  });
}

// Helper function to normalize environment type
function normalizeEnvironment(envType: string): string {
  const envMap: Record<string, string> = {
    integration: "int",
    int: "int",
    "pre-production": "pre",
    pre: "pre",
    production: "prod",
    prod: "prod",
  };

  const normalized = envMap[envType];
  if (!normalized) throw new Error(`Invalid environment ${envType}`);
  return normalized;
}
