import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convert URL to directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url)); //

// Read the cypress.env.json file
const envFilePath = path.resolve(__dirname, "cypress.env.json");
const envConfig = JSON.parse(fs.readFileSync(envFilePath, "utf8")) as { env: { CYPRESS_RECORD_KEY?: string } };

// Extract the CYPRESS_RECORD_KEY
const recordKey = envConfig.env.CYPRESS_RECORD_KEY;

if (!recordKey) {
  console.error("CYPRESS_RECORD_KEY is not defined in cypress.env.json");
  process.exit(1);
}

// Run Cypress with the record key
try {
  execSync(`cypress run --record --key ${recordKey}`, { stdio: "inherit" });
} catch (error) {
  console.error("Failed to run Cypress:", error);
  process.exit(1);
}
