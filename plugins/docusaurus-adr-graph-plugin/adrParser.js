const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Regex patterns for ADR references
const ADR_LINK_PATTERN = /\[ADRs?\s*(\d+)[^\]]*\]\([^)]*adr(\d+)[^)]*\)/gi;
const ADR_TEXT_PATTERN = /ADR[-\s]0*(\d+)\b/gi; // Matches ADR-002, ADR 002, ADR002

/**
 * Recursively find all ADR files (README.md in adr* directories)
 */
function findADRFiles(dir) {
  const adrFiles = [];

  function scan(directory) {
    if (!fs.existsSync(directory)) return;

    const items = fs.readdirSync(directory);

    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item.startsWith('adr')) {
        const readmePath = path.join(fullPath, 'README.md');
        if (fs.existsSync(readmePath)) {
          adrFiles.push(readmePath);
        }
      } else if (stat.isDirectory()) {
        // Scan all subdirectories to find ADRs in hercules, leo, orion
        scan(fullPath);
      }
    }
  }

  scan(dir);
  return adrFiles;
}

/**
 * Extract ADR number from file path
 */
function extractADRNumber(filePath) {
  const match = filePath.match(/adr(\d+)-/);
  return match ? match[1] : null;
}

/**
 * Determine project and category from file path
 */
function getProjectAndCategory(filePath) {
  // Hercules Network ADRs
  if (filePath.includes('hercules_network_adr')) {
    return { project: 'hercules', category: 'network' };
  }
  // Hercules Use Case ADRs
  if (filePath.includes('hercules_use_case_adr')) {
    return { project: 'hercules', category: 'usecase' };
  }
  // Leo ADRs
  if (filePath.includes('/leo/')) {
    return { project: 'leo', category: 'leo' };
  }
  // Orion ADRs
  if (filePath.includes('/orion/')) {
    return { project: 'orion', category: 'orion' };
  }
  // Default fallback
  return { project: 'other', category: 'other' };
}

/**
 * Build the URL path for an ADR
 */
function buildADRPath(filePath, adrNumber, versionPrefix) {
  const slug = extractADRSlug(filePath);
  const { project, category } = getProjectAndCategory(filePath);

  if (project === 'hercules') {
    const section = category === 'network' ? 'hercules_network_adr' : 'hercules_use_case_adr';
    return `${versionPrefix}/${section}/adr${adrNumber}-${slug}`;
  }
  if (project === 'leo') {
    return `${versionPrefix}/leo/adr${adrNumber}-${slug}`;
  }
  if (project === 'orion') {
    return `${versionPrefix}/orion/adr${adrNumber}-${slug}`;
  }
  return `${versionPrefix}/adr${adrNumber}-${slug}`;
}

/**
 * Parse a single ADR file
 */
function parseADRFile(filePath, versionPrefix = '/docs') {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content: markdown } = matter(content);

  const adrNumber = extractADRNumber(filePath);
  if (!adrNumber) return null;

  // Extract references from markdown links and text
  const references = new Set();
  let match;

  // Pattern 1: Markdown links like [ADR 002](./adr002)
  ADR_LINK_PATTERN.lastIndex = 0;
  while ((match = ADR_LINK_PATTERN.exec(markdown)) !== null) {
    const refNumber = match[2] || match[1];
    if (refNumber && refNumber !== adrNumber) {
      references.add(refNumber.padStart(3, '0'));
    }
  }

  // Pattern 2: Text references like ADR-002, ADR 002, ADR002
  ADR_TEXT_PATTERN.lastIndex = 0;
  while ((match = ADR_TEXT_PATTERN.exec(markdown)) !== null) {
    const refNumber = match[1];
    if (refNumber && refNumber !== adrNumber) {
      references.add(refNumber.padStart(3, '0'));
    }
  }

  const { project, category } = getProjectAndCategory(filePath);
  const adrPath = buildADRPath(filePath, adrNumber, versionPrefix);

  return {
    id: `adr${adrNumber.padStart(3, '0')}`,
    number: adrNumber.padStart(3, '0'),
    title: extractTitle(frontmatter.title),
    project,
    category,
    tags: frontmatter.tags || [],
    references: Array.from(references),
    path: adrPath
  };
}

/**
 * Extract clean title from frontmatter title
 */
function extractTitle(title) {
  if (!title) return 'Untitled ADR';
  return title
    .replace(/^ADR\s+\d+\s*[–-]\s*/i, '')
    .replace(/\s+Version\s+[\d.]+$/i, '')
    .trim();
}

/**
 * Extract ADR slug from file path
 */
function extractADRSlug(filePath) {
  const match = filePath.match(/adr\d+-([^/]+)/);
  return match ? match[1] : '';
}

/**
 * Build graph data structure from ADR files
 */
function buildGraphData(docsDir, versionPrefix = '/docs') {
  const adrFiles = findADRFiles(docsDir);
  const nodes = [];
  const edges = [];
  const referenceCountMap = new Map();

  for (const filePath of adrFiles) {
    const adr = parseADRFile(filePath, versionPrefix);
    if (adr) {
      nodes.push({
        id: adr.id,
        number: adr.number,
        title: adr.title,
        project: adr.project,
        category: adr.category,
        tags: adr.tags,
        path: adr.path,
        referenceCount: 0
      });
      referenceCountMap.set(adr.id, adr.references);
    }
  }

  const incomingReferences = new Map();

  for (const [sourceId, targetIds] of referenceCountMap.entries()) {
    for (const targetNumber of targetIds) {
      const targetId = `adr${targetNumber}`;

      // Only create edge if target exists
      if (nodes.some(n => n.id === targetId)) {
        edges.push({
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: 'smoothstep'
        });
        incomingReferences.set(targetId, (incomingReferences.get(targetId) || 0) + 1);
      }
    }
  }

  for (const node of nodes) {
    node.referenceCount = incomingReferences.get(node.id) || 0;
  }

  return { nodes, edges };
}

/**
 * Get all available versions from versions.json
 */
function getVersions(siteDir) {
  const versionsPath = path.join(siteDir, 'versions.json');
  if (fs.existsSync(versionsPath)) {
    return JSON.parse(fs.readFileSync(versionsPath, 'utf8'));
  }
  return [];
}

module.exports = { buildGraphData, getVersions };
