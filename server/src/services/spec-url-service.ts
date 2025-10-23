import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getApiEnvironment } from "../utils/environment";

dotenv.config();

let envConfig: any = null;

const getEnvConfig = () => {
  if (!envConfig) {
    const envFilePath = path.resolve(process.cwd(), "cypress.env.json");
    envConfig = JSON.parse(fs.readFileSync(envFilePath, "utf8"));
  }
  return envConfig;
};

const specUrlService = {
  fetchSpecUrl: async (specId: string, environment: string): Promise<string> => {
    if (!specId?.trim()) throw new Error("Spec ID is required");

    try {
      const processedEnvType = getApiEnvironment(environment);
      const config = getEnvConfig();
      const baseApiUrl: string = config.API_BASE_URL || "moodybible.org/api/episerver/v3.0/content/";
      const apiBaseUrl = `https://${processedEnvType}.${baseApiUrl}`;

      const response = await fetch(`${apiBaseUrl}${specId}`, { method: "GET" });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.url) throw new Error(`Invalid response: missing url field`);

      return data.url;
    } catch (error) {
      console.error(`Failed to fetch spec URL for ID ${specId}:`, error as Error);
      throw error;
    }
  },
};

export default specUrlService;
