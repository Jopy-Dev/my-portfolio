import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);
const optionalHttpsUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z
    .string()
    .url()
    .refine((value) => value.startsWith("https://"), "Expected an HTTPS URL")
    .optional(),
);

const siteEnvironmentSchema = z
  .object({
    SITE_URL: z
      .string()
      .url()
      .refine((value) => value.startsWith("https://"), "Expected an HTTPS URL"),
    SITE_BASE_PATH: z
      .string()
      .default("")
      .refine(
        (value) =>
          value === "" || (/^\/[a-z0-9][a-z0-9._-]*$/iu.test(value) && !value.endsWith("/")),
        "Expected empty or one leading-slash repository path without a trailing slash",
      ),
    DEPLOY_ENV: z.enum(["development", "review", "production"]),
    NEXT_PUBLIC_CONTACT_ENDPOINT: optionalHttpsUrl,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalString,
    NEXT_PUBLIC_GTM_CONTAINER_ID: optionalString,
    NEXT_PUBLIC_POSTHOG_HOST: optionalHttpsUrl,
  })
  .superRefine((value, context) => {
    if (value.DEPLOY_ENV !== "production") return;
    if (!value.NEXT_PUBLIC_CONTACT_ENDPOINT) {
      context.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_CONTACT_ENDPOINT"],
        message: "Required in production",
      });
    }
    if (!value.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      context.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY"],
        message: "Required in production",
      });
    }
  });

export type SiteEnvironment = z.infer<typeof siteEnvironmentSchema>;

export function readSiteEnvironment(source: NodeJS.ProcessEnv = process.env): SiteEnvironment {
  const parsed = siteEnvironmentSchema.safeParse(source);
  if (parsed.success) return parsed.data;
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid site environment: ${details}`);
}
