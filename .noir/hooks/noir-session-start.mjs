#!/usr/bin/env node
// Noir SessionStart hook — injects the skill router contract + anti-slop ruleset
// at session start. The mutable contract lives in .noir/router.md (a Noir
// managed block, so user edits outside the markers survive noir sync) and the
// ruleset in .noir/rules/anti-slop.md (regenerated). This script is a pure runner.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const ROUTER = join(ROOT, '.noir', 'router.md');
const RULES = join(ROOT, '.noir', 'rules', 'anti-slop.md');

function readIfPresent(path) {
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8').trim();
}

function main() {
  const parts = [readIfPresent(ROUTER), readIfPresent(RULES)].filter((part) => part !== '');
  if (parts.length === 0) {
    // Neither contract present (project not initialized / both removed) — silent.
    process.stdout.write(JSON.stringify({ hookSpecificOutput: {} }));
    process.exit(0);
  }
  const context = parts.join('\n\n');
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { additionalContext: context } }),
  );
}

main();
