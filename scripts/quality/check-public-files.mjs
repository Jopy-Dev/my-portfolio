import { execFileSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const INTERNAL_NAMES = new Set([
  "PRD.md",
  "MasterPrompt.md",
  "Design_System.md",
  "PRODUCT.md",
  "DESIGN.md",
  "SESSION_HANDOFF.md",
  "MEMORY.md",
]);

function decodeNullSeparated(buffer) {
  return buffer.toString("utf8").split("\0").filter(Boolean);
}

async function collectMarkdown(directory, rootDirectory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const findings = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) findings.push(...(await collectMarkdown(target, rootDirectory)));
    else if (entry.name.toLowerCase().endsWith(".md")) {
      findings.push(path.relative(rootDirectory, target).replaceAll("\\", "/"));
    }
  }
  return findings;
}

export async function findPublicBoundaryViolations(rootDirectory) {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: rootDirectory },
  );
  const candidates = decodeNullSeparated(output);
  const findings = [];

  for (const candidate of candidates) {
    const normalized = candidate.replaceAll("\\", "/");
    const name = path.posix.basename(normalized);
    if (normalized.startsWith(".codex/") || normalized.startsWith(".impeccable/")) {
      findings.push(`${normalized} internal-directory`);
    }
    if (INTERNAL_NAMES.has(name)) findings.push(`${normalized} internal-document`);
    if (normalized.toLowerCase().endsWith(".md") && normalized !== "README.md") {
      findings.push(`${normalized} markdown-not-allowlisted`);
    }
  }

  const outputDirectory = path.join(rootDirectory, "apps", "site", "out");
  try {
    const markdownFiles = await collectMarkdown(outputDirectory, rootDirectory);
    for (const file of markdownFiles) findings.push(`${file} markdown-in-static-output`);
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
  }
  return findings;
}

async function main() {
  const rootDirectory = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  const findings = await findPublicBoundaryViolations(rootDirectory);
  if (findings.length === 0) {
    console.log("Public-file boundary guard passed.");
    return;
  }
  for (const finding of findings) console.error(finding);
  process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await main();
}
