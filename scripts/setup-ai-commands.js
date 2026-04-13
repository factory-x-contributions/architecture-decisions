#!/usr/bin/env node

/**
 * Setup AI skills for all supported tools.
 *
 * Skills live in .ai/skills/<name>/SKILL.md (Agent Skills Spec format).
 * This script copies them to each tool's skill directory.
 *
 * Use this if symlinks don't work on your system (e.g. Windows without developer mode).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, '.ai', 'skills');

const TARGETS = [
  { dir: '.claude/skills', label: 'Claude Code' },
  { dir: '.cursor/skills', label: 'Cursor' },
  { dir: '.cline/skills',  label: 'Cline' },
];

// Find all skill directories containing a SKILL.md
const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .filter(d => fs.existsSync(path.join(SKILLS_DIR, d.name, 'SKILL.md')));

for (const { dir, label } of TARGETS) {
  const targetDir = path.join(ROOT, dir);
  fs.mkdirSync(targetDir, { recursive: true });

  for (const skill of skillDirs) {
    const src = path.join(SKILLS_DIR, skill.name, 'SKILL.md');
    const dest = path.join(targetDir, `${skill.name}.md`);

    // Skip if already a working symlink
    try {
      const stat = fs.lstatSync(dest);
      if (stat.isSymbolicLink() && fs.existsSync(dest)) continue;
      fs.unlinkSync(dest);
    } catch {}

    fs.copyFileSync(src, dest);
    console.log(`  ${label}: ${dir}/${skill.name}.md`);
  }
}

console.log('\nDone. AI skills are available in all tools.');
