import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SOURCE_EXTENSIONS = new Set([".css", ".ts", ".tsx"]);
const TOKEN_FILE = path.normalize("apps/site/src/styles/tokens.css");
const RAW_COLOR = /(?:#[\da-f]{3,8}\b|\b(?:rgb|hsl|oklch|lab|lch)a?\s*\()/giu;
const STYLE_PROP = /\bstyle\s*=\s*\{/gu;
const CLASS_ATTRIBUTE = /className\s*=\s*(["'])(.*?)\1/gsu;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(target)));
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(target);
  }
  return files;
}

function lineNumber(source, offset) {
  return source.slice(0, offset).split("\n").length;
}

export async function findDesignTokenViolations(rootDirectory) {
  const sourceRoot = path.join(rootDirectory, "apps", "site", "src");
  const files = await collectFiles(sourceRoot);
  const findings = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const relative = path.normalize(path.relative(rootDirectory, file));

    if (relative !== TOKEN_FILE) {
      for (const match of source.matchAll(RAW_COLOR)) {
        findings.push({ file: relative, line: lineNumber(source, match.index), rule: "raw-color" });
      }
    }

    if (file.endsWith(".tsx")) {
      for (const match of source.matchAll(STYLE_PROP)) {
        findings.push({
          file: relative,
          line: lineNumber(source, match.index),
          rule: "inline-style",
        });
      }
      for (const match of source.matchAll(CLASS_ATTRIBUTE)) {
        if (match[2]?.includes("[")) {
          findings.push({
            file: relative,
            line: lineNumber(source, match.index),
            rule: "arbitrary-class-value",
          });
        }
      }
    }
  }

  return findings;
}

async function main() {
  const rootDirectory = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  const findings = await findDesignTokenViolations(rootDirectory);
  if (findings.length === 0) {
    console.log("Design-token guard passed.");
    return;
  }
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.rule}`);
  }
  process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await main();
}
