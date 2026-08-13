export const CONTACT_ENDPOINT_PATH = "/v1/contact" as const;

export type ContactEnvironment = "development" | "dast" | "production";
export type DeliveryMode = "fake" | "cloudflare";
