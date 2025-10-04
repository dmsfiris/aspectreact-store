#!/usr/bin/env node
/**
 * Add or update SPDX copyright headers across the repo (fork-aware, upstream preserved).
 *
 * Excludes:
 * - .github/, .husky/, node_modules/, build/, dist/
 * - LICENSE files
 * - .json, .md
 * - .env* (e.g., .env, .env.local, .env.example)
 * - Shell scripts: .sh, .bash
 * - HTML: .html, .htm
 * - Specific files: .gitignore, .eslintignore, package-lock.json, tailwind.config.js
 *
 * Usage:
 *   node tools/copyright-headers.mjs             # apply (write mode)
 *   node tools/copyright-headers.mjs --check     # dry-run, non-zero exit if missing/outdated
 *
 * Configurable via flags or env:
 *   --owner "Your Name"                (or env COPYRIGHT_OWNER, or package.json:config)
 *   --spdx-id GPL-3.0-or-later         (or env SPDX_ID, or package.json:config)
 *   --default-start 2025               (or env COPYRIGHT_START, or package.json:config)
 *   --no-range                         # force single year instead of ranges
 *   --author-line                      # include an "Author: <name>" line
 *   --author "Name"                    # defaults to OWNER if omitted
 *
 * IMPORTANT NOTICE:
 * This project is under GPL-3.0-or-later. The GPL requires that existing copyright
 * and license notices be preserved when you redistribute source code. This tool helps
 * you comply by always including the upstream/original author’s notice. Do not remove
 * or alter upstream notices in derived works; doing so may violate copyright law and
 * the GPL’s notice-preservation obligations.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { extname, resolve, basename } from "node:path";

/* -------------------- Constants (Upstream) -------------------- */
/**
 * Upstream/original author whose notice must be preserved in redistributed source.
 * This value is hard-coded by design and is not user-configurable. Changing or removing
 * it in a fork is a violation of your obligation to preserve upstream notices under the GPL.
 */
const UPSTREAM_OWNER = "Dimitrios S. Sfyris";

/* -------------------- CLI parsing -------------------- */
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
  }
  return res;
}

const args = parseArgs(process.argv.slice(2), {
  owner: { type: "string" },
  author: { type: "string" },
  year: { type: "string" },
  "default-start": { type: "string" },
  "spdx-id": { type: "string" },
  "no-range": { type: "boolean", default: false },
  "author-line": { type: "boolean", default: false },
  check: { type: "boolean", default: false },
});

/* -------------------- Helpers -------------------- */
function readJSON(path) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return null; }
}
function getPkg() { return readJSON(resolve(process.cwd(), "package.json")) || {}; }
function gitUserName() {
  try { return execSync("git config --get user.name", { encoding: "utf8" }).trim() || null; }
  catch { return null; }
}
function toBool(val, fallback = false) {
  if (val === undefined || val === null) return fallback;
  return ["1","true","yes","on"].includes(String(val).toLowerCase());
}

const pkg = getPkg();
const CURRENT_YEAR = new Date().getFullYear();

const OWNER =
  args.owner ||
  process.env.COPYRIGHT_OWNER ||
  process.env.npm_package_config_copyrightOwner ||
  (typeof pkg.author === "string" ? pkg.author : pkg.author?.name) ||
  gitUserName() ||
  "Unknown Owner";

const SPDX_ID =
  args["spdx-id"] ||
  process.env.SPDX_ID ||
  process.env.npm_package_config_spdxId ||
  pkg?.config?.spdxId ||
  "GPL-3.0-or-later";

const FORCE_YEAR = args.year ? String(args.year) : null;
const DEFAULT_START =
  args["default-start"] ||
  process.env.COPYRIGHT_START ||
  process.env.npm_package_config_copyrightStart ||
  pkg?.config?.copyrightStart ||
  null;

const USE_RANGE = !args["no-range"];
const ADD_AUTHOR_LINE = args["author-line"] || toBool(process.env.ADD_AUTHOR_LINE, false);
const AUTHOR_NAME = args.author || process.env.AUTHOR_NAME || OWNER;

/* -------------------- File inclusion & styles -------------------- */
const EXT_STYLE = {
  ".js": "block",
  ".jsx": "block",
  ".ts": "block",
  ".tsx": "block",
  ".css": "block",
  ".scss": "block",
  ".less": "block",
  // intentionally allow XML/SVG (keep if you still want headers there)
  ".xml": "xml",
  ".svg": "xml",
  // YAML stays allowed
  ".yml": "line",
  ".yaml": "line",
  // text files
  ".txt": "line",
  // NOTE: we *do not* register .html, .htm, .sh, .bash, or .env* here
};

// Skip these directories entirely
const SKIP_DIRS_RE = /^(?:node_modules|build|dist|\.github|\.husky)\//;

// Skip these extensions entirely (even for dotfiles)
const SKIP_EXTS = new Set([
  ".json",
  ".md",
  ".html",
  ".htm",
  ".sh",
  ".bash",
]);

// Skip these specific filenames (anywhere in repo)
const SKIP_FILES = new Set([
  ".gitignore",
  ".eslintignore",
  "package-lock.json",
  "tailwind.config.js",
]);

function isLicenseFile(file) {
  const n = basename(file).toLowerCase();
  return n === "license" || n.startsWith("license.");
}

// Skip .env* (e.g., .env, .env.local, .env.example)
function isEnvDotfile(file) {
  const n = basename(file);
  return /^\.env(\.|$)/i.test(n); // .env OR .env.*
}

function listTrackedFiles() {
  const out = execSync("git ls-files", { encoding: "utf8" });
  return out.split("\n").filter(Boolean);
}

function includeFile(file) {
  if (SKIP_DIRS_RE.test(file)) return false;
  if (isLicenseFile(file)) return false;
  if (isEnvDotfile(file)) return false;

  const base = basename(file);
  if (SKIP_FILES.has(base)) return false;

  const ext = extname(file).toLowerCase();
  if (SKIP_EXTS.has(ext)) return false;

  // Known styles by extension
  if (EXT_STYLE[ext]) return true;

  // Dotfiles without extension (e.g., .gitignore would be caught above)
  if (/^\./.test(file)) {
    return true; // keep plain dotfiles like .npmrc, .editorconfig if you want headers there
  }

  return false;
}

function pickStyle(file) {
  const ext = extname(file).toLowerCase();
  return EXT_STYLE[ext] || (file.startsWith(".") ? "line" : null);
}

/* -------------------- Year / Header helpers -------------------- */
function makeYearText(first, last, useRange) {
  if (!useRange || first === last) return String(last);
  return `${first}-${last}`;
}
function deriveYearTextForFile(file) {
  if (FORCE_YEAR) return String(FORCE_YEAR);
  try {
    const out = execSync(
      `git log --follow --date=format:%Y --pretty=format:%ad -- "${file}"`,
      { encoding: "utf8" }
    );
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
function formatHeader(lines, style) {
  switch (style) {
    case "block":
      return "/*\n * " + lines.join("\n * ") + "\n */\n";
    case "html":
    case "xml":
      return "<!--\n  " + lines.join("\n  ") + "\n-->\n";
    case "line":
    default:
      return "# " + lines.join("\n# ") + "\n";
  }
}

/* -------------------- Existing header parsing -------------------- */
const BLOCK_RE = /^\/\*[\s\S]*?\*\/\s*/;
const HTML_RE = /^<!--[\s\S]*?-->\s*/;
const LINE_RE = /^(?:# .*\n)+/;

// Accept both "Copyright" and "Original Copyright"
const COPYRIGHT_LINE_RE = /^(?:Original\s+)?Copyright\s+\(C\)\s+([0-9]{4}(?:-[0-9]{4})?)\s+(.+)$/i;
const SPDX_RE = /SPDX-License-Identifier:\s*([A-Za-z0-9.\-+]+)/i;

function extractTopComment(content) {
  const m = content.match(BLOCK_RE) || content.match(HTML_RE) || content.match(LINE_RE);
  if (m && m.index === 0) return m[0];
  return "";
}

function parseExistingMeta(blockText) {
  const lines = blockText.split(/\r?\n/);
  const copyrights = [];
  let spdx = null;

  for (const raw of lines) {
    const line = raw.replace(/^[/*\s#-]+|[*/\s-]+$/g, "");
    const m1 = line.match(COPYRIGHT_LINE_RE);
    if (m1) {
      const [, years, owner] = m1;
      const isOriginal = /^Original\s+Copyright/i.test(line);
      copyrights.push({ years: years.trim(), owner: owner.trim(), isOriginal });
    }
    const m2 = line.match(SPDX_RE);
    if (m2) spdx = m2[1].trim();
  }
  return { copyrights, spdx };
}

/* -------------------- Build merged header -------------------- */
function buildMergedHeader(file, style, existingBlock) {
  const yearText = deriveYearTextForFile(file);

  const { copyrights: existing, spdx: existingSpdx } = parseExistingMeta(existingBlock);
  const finals = [];

  // 1) Preserve existing notices (dedupe by owner, keep order)
  for (const c of existing) {
    if (!finals.some((fc) => fc.owner.toLowerCase() === c.owner.toLowerCase())) {
      finals.push({ years: c.years, owner: c.owner });
    }
  }

  // 2) Ensure upstream/original owner is present (always enforced)
  const hasUpstream = finals.some((fc) => fc.owner.toLowerCase() === UPSTREAM_OWNER.toLowerCase());
  if (!hasUpstream) {
    const upstreamYears = DEFAULT_START
      ? makeYearText(Number(DEFAULT_START), CURRENT_YEAR, USE_RANGE)
      : String(CURRENT_YEAR);
    finals.unshift({ years: upstreamYears, owner: UPSTREAM_OWNER, isUpstream: true });
    console.log(`[INFO] Preserving upstream notice: "${UPSTREAM_OWNER}"`);
  }

  // 3) Ensure current OWNER is present (if meaningful and not duplicate)
  const ownerIsMeaningful = OWNER && OWNER !== "Unknown Owner";
  if (ownerIsMeaningful && !finals.some((fc) => fc.owner.toLowerCase() === OWNER.toLowerCase())) {
    finals.push({ years: yearText, owner: OWNER, isUpstream: false });
    console.log(`[INFO] Adding current owner notice: "${OWNER}"`);
  }

  // 4) Build display lines
  const multipleOwners = finals.length > 1;
  const headerLines = [];

  for (const c of finals) {
    const label =
      multipleOwners && c.owner.toLowerCase() === UPSTREAM_OWNER.toLowerCase()
        ? "Original Copyright"
        : "Copyright";
    headerLines.push(`${label} (C) ${c.years} ${c.owner}`);
  }

  if (ADD_AUTHOR_LINE && AUTHOR_NAME) {
    headerLines.push(`Author: ${AUTHOR_NAME}`);
  }

  headerLines.push(`SPDX-License-Identifier: ${existingSpdx || SPDX_ID}`);

  return headerLines;
}

/* -------------------- Apply header (with XML/shebang care) -------------------- */
function applyMergedHeader(file, content, style) {
  // XML prolog: insert header right after <?xml ...?>
  if (style === "xml") {
    const trimmed = content.trimStart();
    const prologIdx = trimmed.startsWith("<?xml") ? content.indexOf("?>") : -1;
    if (prologIdx >= 0) {
      const after = prologIdx + 2;
      const rest = content.slice(after).replace(/^\s*/, "");
      const existingBlock = extractTopComment(rest);
      const headerLines = buildMergedHeader(file, style, existingBlock);
      const newHeader = formatHeader(headerLines, style);
      const restReplaced = existingBlock ? rest.replace(existingBlock, newHeader) : newHeader + rest;
      return { changed: true, newContent: content.slice(0, after) + "\n" + restReplaced };
    }
  }

  // Shebang: keep it as the very first line
  if (style === "line" && content.startsWith("#!")) {
    const nl = content.indexOf("\n");
    const shebang = nl >= 0 ? content.slice(0, nl + 1) : content + "\n";
    const rest = nl >= 0 ? content.slice(nl + 1) : "";
    const existingBlock = extractTopComment(rest);
    const headerLines = buildMergedHeader(file, style, existingBlock);
    const newHeader = formatHeader(headerLines, style);
    const restReplaced = existingBlock ? rest.replace(existingBlock, newHeader) : newHeader + rest;
    return { changed: true, newContent: shebang + restReplaced };
  }

  // Normal case
  const existingBlock = extractTopComment(content);
  const headerLines = buildMergedHeader(file, style, existingBlock);
  const newHeader = formatHeader(headerLines, style);

  if (!existingBlock) {
    return { changed: true, newContent: newHeader + content };
  }
  const newContent = content.replace(existingBlock, newHeader);
  const changed = newContent !== content;
  return { changed, newContent };
}

/* -------------------- Main -------------------- */
function main() {
  const files = listTrackedFiles().filter(includeFile);
  let missing = 0, updated = 0, unchanged = 0, skipped = 0;

  for (const f of files) {
    try {
      const style = pickStyle(f);
      if (!style) { skipped++; continue; }

      const content = readFileSync(f, "utf8");
      const existingBlock = extractTopComment(content);
      const { copyrights, spdx } = parseExistingMeta(existingBlock);

      if (args.check) {
        let fileMissing = false;

        if (!spdx) {
          console.log(`[CHECK] Missing SPDX in: ${f}`);
          fileMissing = true;
        }
        if (!copyrights.length) {
          console.log(`[CHECK] Missing copyright notice in: ${f}`);
          fileMissing = true;
        }

        // ALWAYS require upstream owner presence
        const hasUpstream = copyrights.some(
          (c) => c.owner.toLowerCase() === UPSTREAM_OWNER.toLowerCase()
        );
        if (!hasUpstream) {
          console.log(`[CHECK] Upstream owner "${UPSTREAM_OWNER}" not found in: ${f}`);
          fileMissing = true;
        }

        // Encourage current OWNER presence (strict in this repo; optional in forks)
        const ownerIsMeaningful = OWNER && OWNER !== "Unknown Owner";
        if (ownerIsMeaningful) {
          const hasCurrent = copyrights.some(
            (c) => c.owner.toLowerCase() === OWNER.toLowerCase()
          );
          if (!hasCurrent) {
            console.log(`[CHECK] Current owner "${OWNER}" missing in: ${f}`);
            fileMissing = true;
          }
        }

        if (fileMissing) missing++;
        continue;
      }

      // Write mode: merge & apply
      const { changed, newContent } = applyMergedHeader(f, content, style);
      if (changed) {
        writeFileSync(f, newContent, "utf8");
        updated++;
        console.log(`[WRITE] Updated header: ${f}`);
      } else {
        unchanged++;
      }
    } catch (err) {
      console.error(`[ERROR] ${f}: ${err.message}`);
      skipped++;
    }
  }

  const mode = args.check ? "check" : "write";
  console.log(`\nOwner:    ${OWNER}`);
  console.log(`Upstream: ${UPSTREAM_OWNER} (preserved & enforced)`);
  console.log(`SPDX:     ${SPDX_ID}`);
  if (DEFAULT_START) console.log(`Default start year: ${DEFAULT_START}`);
  console.log(`Author line: ${ADD_AUTHOR_LINE ? `on (${AUTHOR_NAME})` : "off"}`);
  console.log(`Done (${mode}). Updated: ${updated}, Unchanged: ${unchanged}, Missing: ${missing}, Skipped: ${skipped}`);

  if (args.check && missing > 0) {
    process.exit(2);
  }
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
