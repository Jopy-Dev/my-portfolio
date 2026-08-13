import assert from "node:assert/strict";
import { test } from "node:test";
import { findDesignTokenViolations } from "./check-design-tokens.mjs";
import { inspectEnvExample } from "./check-env-example.mjs";

test("environment guard reports missing and public-secret keys", () => {
  const findings = inspectEnvExample("NEXT_PUBLIC_SECRET=unsafe\n");
  assert.ok(findings.some((finding) => finding.includes("secret-like-public-key")));
  assert.ok(findings.some((finding) => finding.includes("missing-key SITE_URL")));
});

test("design-token guard accepts the current source tree", async () => {
  const findings = await findDesignTokenViolations(process.cwd());
  assert.deepEqual(findings, []);
});
