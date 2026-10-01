const apiUrl = process.env.API_URL ?? "http://localhost:4000";

export const API_BASE = `${apiUrl.replace(/\/$/, "")}/api`;

export const BFF_BASE = "/api/backend";
