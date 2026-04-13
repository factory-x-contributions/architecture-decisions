const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const ADR_DIR_PATTERN = /^adr(\d+)-(.+)$/;
const ADR_ID_PATTERN = /^fx_adr\w+$/;

const errors = [];
const adrNumbers = new Map(); // number -> directory path (for uniqueness check)

function scan(directory) {
  if (!fs.existsSync(directory)) return;

  for (const item of fs.readdirSync(directory)) {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);

    if (!stat.isDirectory()) continue;

    if (item.startsWith('adr')) {
      lintADRDirectory(fullPath, item);
    } else {
      scan(fullPath);
    }
  }
}

function lintADRDirectory(dirPath, dirName) {
  const rel = path.relative(path.join(__dirname, '..'), dirPath);

  // Check directory name pattern
  const dirMatch = ADR_DIR_PATTERN.exec(dirName);
  if (!dirMatch) {
    errors.push(`${rel}: Directory name must match pattern adrXXX-{slug} (e.g. adr002-my-topic)`);
    return;
  }

  const adrNumber = dirMatch[1];

  // Check uniqueness of ADR number
  if (adrNumbers.has(adrNumber)) {
    errors.push(`${rel}: Duplicate ADR number ${adrNumber} (already used by ${adrNumbers.get(adrNumber)})`);
  } else {
    adrNumbers.set(adrNumber, rel);
  }

  // Check README.md exists with exact casing
  const files = fs.readdirSync(dirPath);
  const readmeFile = files.find(f => f.toLowerCase() === 'readme.md');

  if (!readmeFile) {
    errors.push(`${rel}: Missing README.md`);
    return;
  }

  if (readmeFile !== 'README.md') {
    errors.push(`${rel}: Found '${readmeFile}' but expected exact name 'README.md'`);
  }

  // Validate frontmatter
  const readmePath = path.join(dirPath, readmeFile);
  const content = fs.readFileSync(readmePath, 'utf8');
  let frontmatter;

  try {
    ({ data: frontmatter } = matter(content));
  } catch (e) {
    errors.push(`${rel}/README.md: Invalid frontmatter — ${e.message}`);
    return;
  }

  if (!frontmatter.id) {
    errors.push(`${rel}/README.md: Missing required frontmatter field 'id'`);
  } else if (!ADR_ID_PATTERN.test(frontmatter.id)) {
    errors.push(`${rel}/README.md: 'id' must match pattern fx_adrXXX (got '${frontmatter.id}')`);
  }

  if (!frontmatter.title) {
    errors.push(`${rel}/README.md: Missing required frontmatter field 'title'`);
  }
}

// Run
scan(DOCS_DIR);

if (errors.length > 0) {
  console.error(`\nADR Lint: ${errors.length} error(s) found:\n`);
  for (const err of errors) {
    console.error(`  ✗ ${err}`);
  }
  console.error('');
  process.exit(1);
} else {
  console.log('ADR Lint: All checks passed.');
}
