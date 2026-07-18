const apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("API_BASE_URL is required.");
}

export const API_BASE_URL = apiBaseUrl;
