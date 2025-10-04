#!/usr/bin/env node
/**
 * Add or update SPDX copyright headers across the repo.
 * - Computes year range per file from git history (first..last year).
 * - Supports block and line comment styles by extension.
 * - Skips node_modules, build, dist automatically (via git ls-files).
 *
 * Usage examples:
 *   node tools/copyright-headers.mjs --owner "Your Name or Org" --default-start 2025
 *   node tools/copyright-headers.mjs --owner "Your Org" --spdx-id GPL-3.0-or-later --check
 *   node tools/copyright-headers.mjs --owner "Your Org" --no-range --year 2025
 *
 * Requires: git
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";

const args = parseArgs(process.argv.slice(2), {
  owner: { type: "string", required: true },
  year: { type: "string" }, // force single year
  "default-start": { type: "string" }, // fallback start year if git history missing
  "spdx-id": { type: "string", default: "GPL-3.0-or-later" },
  "no-range": { type: "boolean", default: false }, // when true, only use single year
  check: { type: "boolean", default: false } // dry-run: report missing/mismatch
});

const OWNER = args.owner;
const SPDX_ID = args["spdx-id"];
const FORCE_YEAR = args.year ? String(args.year) : null;
const DEFAULT_START = args["default-start"] ? String(args["default-start"]) : null;
const USE_RANGE = !args["no-range"];
const CURRENT_YEAR = new Date().getFullYear();

const EXT_STYLE = {
  ".js": "block",
  ".jsx": "block",
  ".ts": "block",
  ".tsx": "block",
  ".css": "block",
  ".scss": "block",
  ".less": "block",
  ".html": "html",
  ".htm": "html",
  ".xml": "xml",
  ".svg": "xml",
  ".sh": "line",
  ".bash": "line",
  ".yml": "line",
  ".yaml": "line",
  ".env": "line",
  ".env.local": "line",
  ".env.example": "line",
  ".txt": "line",
  ".md": "md"
};

function main() {
  const files = listTrackedFiles().filter(includeFile);
  let missing = 0, updated = 0, unchanged = 0, skipped = 0;

  for (const f of files) {
    try {
      const style = pickStyle(f);
      if (!style) { skipped++; continue; }

      const content = readFileSync(f, "utf8");
      const header = buildHeaderForFile(f, style);

      const { hasHeader, needsUpdate, newContent } = applyHeader(f, content, header, style);
      if (hasHeader && !needsUpdate) {
        unchanged++;
      } else if (args.check) {
        missing++;
        console.log(`[CHECK] Missing or outdated header: ${f}`);
      } else {
        writeFileSync(f, newContent, "utf8");
        updated++;
        console.log(`[WRITE] Updated header: ${f}`);
      }
    } catch (err) {
      console.error(`[ERROR] ${f}: ${err.message}`);
      skipped++;
    }
  }

  const mode = args.check ? "check" : "write";
  console.log(`\nDone (${mode}). Updated: ${updated}, Unchanged: ${unchanged}, Missing: ${missing}, Skipped: ${skipped}`);
}

function listTrackedFiles() {
  const out = execSync("git ls-files", { encoding: "utf8" });
  return out.split("\n").filter(Boolean);
}

function includeFile(file) {
  if (/^(node_modules|build|dist)\//.test(file)) return false;
  const ext = extname(file).toLowerCase();
  if (EXT_STYLE[ext]) return true;

  // dotfiles without ext (e.g., .gitignore, .env)
  if (/^\./.test(file) && !/\.(png|jpg|jpeg|gif|ico|lock|map|pdf|zip|gz|svgz)$/i.test(file)) return true;

  return false;
}

function pickStyle(file) {
  const ext = extname(file).toLowerCase();
  return EXT_STYLE[ext] || (file.startsWith(".") ? "line" : null);
}

function buildHeaderForFile(file, style) {
  const years = FORCE_YEAR ? FORCE_YEAR : deriveYearRange(file);
  const yearText = String(years);
  const lines = [
    `Copyright (C) ${yearText} ${OWNER}`,
    `SPDX-License-Identifier: ${SPDX_ID}`
  ];
  return formatHeader(lines, style);
}

function deriveYearRange(file) {
  try {
    const out = execSync(`git log --follow --date=format:%Y --pretty=format:%ad -- "${file}"`, { encoding: "utf8" });
    const years = out.split("\n").filter(Boolean).map(Number).sort();
    if (years.length === 0) {
      return DEFAULT_START ? makeYearText(Number(DEFAULT_START), CURRENT_YEAR, USE_RANGE) : String(CURRENT_YEAR);
    }
    const first = years[0];
    const last = years[years.length - 1];
    return makeYearText(first, last, USE_RANGE);
  } catch {
    return DEFAULT_START ? makeYearText(Number(DEFAULT_START), CURRENT_YEAR, USE_RANGE) : String(CURRENT_YEAR);
  }
}

function makeYearText(first, last, useRange) {
  if (!useRange || first === last) return String(last);
  return `${first}-${last}`;
}

function formatHeader(lines, style) {
  switch (style) {
    case "block":
      return "/*\n * " + lines.join("\n * ") + "\n */\n";
    case "html":
      return "<!--\n  " + lines.join("\n  ") + "\n-->\n";
    case "xml":
      return "<!--\n  " + lines.join("\n  ") + "\n-->\n";
    case "md":
      return "> " + lines[0] + " — " + lines[1] + "\n\n";
    case "line":
    default:
      return "# " + lines[0] + "\n# " + lines[1] + "\n";
  }
}

function applyHeader(file, content, header, style) {
  // Special-case XML prolog: insert after <?xml ...?>
  if (style === "xml") {
    const trimmed = content.trimStart();
    if (/^<\?xml\b/.test(trimmed)) {
      const idx = content.indexOf("?>");
      const after = idx >= 0 ? idx + 2 : 0;
      const existing = content.slice(after).trimStart();
      const withoutHeader = stripExistingHeader(existing);
      const newContent = content.slice(0, after) + "\n" + header + withoutHeader;
      const hasHeader = existing !== withoutHeader;
      const needsUpdate = hasHeader; // we rewrote it
      return { hasHeader, needsUpdate, newContent };
    }
  }

  // Special-case shebang for shell or scripts: keep shebang on top
  if (style === "line" && content.startsWith("#!")) {
    const nl = content.indexOf("\n");
    const shebang = nl >= 0 ? content.slice(0, nl + 1) : content + "\n";
    const rest = nl >= 0 ? content.slice(nl + 1) : "";
    const withoutHeader = stripExistingHeader(rest);
    const hasHeader = rest !== withoutHeader;
    const newContent = shebang + header + withoutHeader;
    const needsUpdate = hasHeader;
    return { hasHeader, needsUpdate, newContent };
  }

  const withoutHeader = stripExistingHeader(content);
  const hasHeader = withoutHeader.length !== content.length;
  const needsUpdate = hasHeader; // simplest: if header exists, we replace to be sure
  const newContent = header + withoutHeader;
  return { hasHeader, needsUpdate, newContent };
}

function stripExistingHeader(content) {
  // Remove our recognizable headers at the very top only
  const patterns = [
    // block comment
    /^\/\*[\s\S]*?\*\/\s*/,
    // HTML/XML comment
    /^<!--[\s\S]*?-->\s*/,
    // line comments (# ...)
    /^(?:# .*\n)+/,
    // markdown quote
    /^(?:> .*\n)+/
  ];

  let out = content;
  for (const re of patterns) {
    const m = out.match(re);
    if (m && m.index === 0) {
      if (/SPDX-License-Identifier/.test(m[0]) || /Copyright \(C\)/.test(m[0])) {
        out = out.slice(m[0].length);
        break;
      }
    }
  }
  return out;
}

function parseArgs(argv, schema) {
  const res = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith("--")) continue;
    const key = tok.slice(2);
    const def = schema[key];
    if (!def) continue;
    if (def.type === "boolean") {
      res[key] = true;
    } else {
      const val = argv[i + 1];
      if (val && !val.startsWith("--")) {
        res[key] = val;
        i++;
      }
    }
  }
  for (const [k, v] of Object.entries(schema)) {
    if (!(k in res) && "default" in v) res[k] = v.default;
    if (v.required && !(k in res)) {
      console.error(`Missing required flag --${k}`);
      process.exit(1);
    }
  }
  return res;
}

// Top-level execution with try/catch (avoids .catch on undefined if main is sync)
try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
