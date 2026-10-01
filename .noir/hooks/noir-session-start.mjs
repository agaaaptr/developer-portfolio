#!/usr/bin/env node
// Noir SessionStart hook — injects the skill router contract at session start.
// The mutable contract lives in .noir/router.md (a Noir managed block, so user
// edits outside the markers survive noir sync). This script is a pure runner.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const ROUTER = join(ROOT, '.noir', 'router.md');

function main() {
  if (!existsSync(ROUTER)) {
    // No router contract (project not initialized / router removed) — silent.
    process.stdout.write(JSON.stringify({ hookSpecificOutput: {} }));
    process.exit(0);
  }
  const contract = readFileSync(ROUTER, 'utf8').trim();
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { additionalContext: contract } }),
  );
}

main();
