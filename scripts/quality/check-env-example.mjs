import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REQUIRED_KEYS = new Set([
  "SITE_URL",
  "SITE_BASE_PATH",
  "DEPLOY_ENV",
  "NEXT_PUBLIC_CONTACT_ENDPOINT",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "NEXT_PUBLIC_GTM_CONTAINER_ID",
  "NEXT_PUBLIC_POSTHOG_HOST",
  "ENVIRONMENT",
  "DELIVERY_MODE",
  "ALLOWED_ORIGINS",
  "ALLOWED_TURNSTILE_HOSTNAMES",
  "CONTACT_FROM_EMAIL",
  "TURNSTILE_SECRET_KEY",
  "CONTACT_TO_EMAIL",
  "ABUSE_KEY_SECRET",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ACCOUNT_ID",
  "PRIVATE_CONTACT_DENYLIST",
]);

const PUBLIC_SECRET_PATTERN = /^NEXT_PUBLIC_.*(?:SECRET|TOKEN|PASSWORD|PRIVATE)/u;

export function inspectEnvExample(source) {
  const keys = new Set();
  const findings = [];

  source.split(/\r?\n/u).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf("=");
    if (separator < 1) {
      findings.push(`.env.example:${index + 1} invalid-entry`);
      return;
    }
    const key = trimmed.slice(0, separator);
    if (keys.has(key)) findings.push(`.env.example:${index + 1} duplicate-key ${key}`);
    keys.add(key);
    if (PUBLIC_SECRET_PATTERN.test(key)) {
      findings.push(`.env.example:${index + 1} secret-like-public-key ${key}`);
    }
  });

  for (const key of REQUIRED_KEYS) {
    if (!keys.has(key)) findings.push(`.env.example missing-key ${key}`);
  }
  for (const key of keys) {
    if (!REQUIRED_KEYS.has(key)) findings.push(`.env.example unapproved-key ${key}`);
  }
  return findings;
}

async function main() {
  const rootDirectory = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  const source = await readFile(path.join(rootDirectory, ".env.example"), "utf8");
  const findings = inspectEnvExample(source);
  if (findings.length === 0) {
    console.log("Environment example guard passed.");
    return;
  }
  for (const finding of findings) console.error(finding);
  process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await main();
}
