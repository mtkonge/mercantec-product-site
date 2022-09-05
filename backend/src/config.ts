export const PORT = 8000;
export const SITE_URL = "http://localhost:8000";

if (SITE_URL.includes("localhost"))
    console.warn("=== option SITE_URL is set to development url ===");
