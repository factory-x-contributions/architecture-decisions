import React, { useMemo, useState, useCallback } from 'react';

import styles from './GherkinScenarios.module.css';

// ─── Parser ──────────────────────────────────────────────────────────────────

const STEP_KEYWORD_RE = /^(Given|When|Then|And|But)\b(.*)/;
const TAG_LINE_RE = /^(@\S+(?:\s+@\S+)*)\s*$/;

function parseGherkin(text) {
  const lines = text.split('\n');
  const feature = { title: '', description: [], scenarios: [] };
  let i = 0;

  while (i < lines.length && lines[i].trim() === '') i++;

  if (i < lines.length && lines[i].trim().startsWith('Feature:')) {
    feature.title = lines[i].trim().replace(/^Feature:\s*/, '');
    i++;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t === '' || t.startsWith('@') || t.startsWith('Scenario') || t.startsWith('#')) break;
      feature.description.push(t);
      i++;
    }
  }

  let pendingTags = [];

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();
    i++;

    if (trimmed === '' || trimmed.startsWith('#')) continue;

    if (TAG_LINE_RE.test(trimmed)) {
      pendingTags = pendingTags.concat(trimmed.split(/\s+/).filter(t => t.startsWith('@')));
      continue;
    }

    if (trimmed.startsWith('Scenario Outline:') || trimmed.startsWith('Scenario:')) {
      const isOutline = trimmed.startsWith('Scenario Outline:');
      const scenario = {
        title: trimmed.replace(/^Scenario(?: Outline)?:\s*/, ''),
        isOutline,
        tags: pendingTags,
        steps: [],
        examples: null,
      };
      pendingTags = [];

      let inExamples = false;
      let exHeaders = [];
      let exRows = [];
      let lastStep = null;

      while (i < lines.length) {
        const sRaw = lines[i];
        const sTrimmed = sRaw.trim();

        if (sTrimmed === '') { i++; break; }
        if (sTrimmed.startsWith('@') || sTrimmed.startsWith('Scenario')) break;
        if (sTrimmed.startsWith('#')) { i++; break; }

        if (sTrimmed.startsWith('Examples:')) {
          inExamples = true;
          i++;
          continue;
        }

        if (inExamples) {
          if (sTrimmed.startsWith('|')) {
            const cells = sTrimmed.split('|').map(c => c.trim()).filter(c => c !== '');
            if (exHeaders.length === 0) exHeaders = cells;
            else exRows.push(cells);
          }
          i++;
          continue;
        }

        const stepMatch = sTrimmed.match(STEP_KEYWORD_RE);
        if (stepMatch) {
          lastStep = { keyword: stepMatch[1], text: stepMatch[2].trim() };
          scenario.steps.push(lastStep);
          i++;
          continue;
        }

        if (lastStep && sRaw.match(/^ {6}/)) {
          lastStep.text += ' ' + sTrimmed;
          i++;
          continue;
        }

        i++;
      }

      if (inExamples && exHeaders.length > 0) {
        scenario.examples = { headers: exHeaders, rows: exRows };
      }

      feature.scenarios.push(scenario);
    }
  }

  return feature;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTagType(tags) {
  if (tags.includes('@smoke'))    return 'smoke';
  if (tags.includes('@edge'))     return 'edge';
  if (tags.includes('@negative')) return 'negative';
  return 'other';
}

function getAdrTag(tags) {
  return tags.find(t => /^@ADR-/.test(t)) ?? null;
}

function scenarioToGherkin(scenario) {
  const tags = scenario.tags.join(' ');
  const keyword = scenario.isOutline ? 'Scenario Outline' : 'Scenario';
  const steps = scenario.steps.map(s => `    ${s.keyword} ${s.text}`).join('\n');
  let text = `  ${tags}\n  ${keyword}: ${scenario.title}\n${steps}`;
  if (scenario.examples) {
    text += '\n\n    Examples:\n';
    text += '      | ' + scenario.examples.headers.join(' | ') + ' |\n';
    text += scenario.examples.rows.map(r => '      | ' + r.join(' | ') + ' |').join('\n');
  }
  return text;
}

const SECTION_META = {
  smoke:    { label: 'Smoke',    badgeClass: 'badgeSmoke',    title: 'Happy Path — Smoke Tests' },
  edge:     { label: 'Edge',     badgeClass: 'badgeEdge',     title: 'Boundary / Equivalence — Edge Cases' },
  negative: { label: 'Negative', badgeClass: 'badgeNegative', title: 'Error Handling — Negative Tests' },
  other:    { label: 'Other',    badgeClass: 'badgeAdr',      title: 'Other Scenarios' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepList({ steps }) {
  return (
    <ul className={styles.steps}>
      {steps.map((step, idx) => {
        const kwClass = styles[`keyword${step.keyword}`] ?? styles.keywordAnd;
        return (
          <li key={idx} className={styles.step}>
            <span className={`${styles.keyword} ${kwClass}`}>{step.keyword}</span>
            <span className={styles.stepText}>{step.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ExamplesTable({ examples }) {
  if (!examples) return null;
  return (
    <div className={styles.examplesBlock}>
      <div className={styles.examplesLabel}>Examples</div>
      <table className={styles.examplesTable}>
        <thead>
          <tr>{examples.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {examples.rows.map((row, ri) => (
            <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CopyButton({ scenario }) {
  const [state, setState] = useState('idle'); // 'idle' | 'copied'

  const handleCopy = useCallback((e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(scenarioToGherkin(scenario)).then(() => {
      setState('copied');
      setTimeout(() => setState('idle'), 1800);
    });
  }, [scenario]);

  return (
    <button
      className={`${styles.copyBtn} ${state === 'copied' ? styles.copyBtnSuccess : ''}`}
      onClick={handleCopy}
      title="Copy Gherkin"
      aria-label="Copy Gherkin to clipboard"
    >
      {state === 'copied' ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function ScenarioCard({ scenario }) {
  const adrTag = getAdrTag(scenario.tags);
  return (
    <details className={`${styles.scenario} ${scenario.isOutline ? styles.scenarioIsOutline : ''}`}>
      <summary className={styles.scenarioSummary}>
        <span className={styles.scenarioTitle}>
          {scenario.isOutline && <em>Outline: </em>}{scenario.title}
        </span>
        <span className={styles.scenarioMeta}>
          {adrTag && <span className={styles.badgeAdr}>{adrTag.replace('@', '')}</span>}
          <span className={styles.stepCount}>{scenario.steps.length} steps</span>
          <CopyButton scenario={scenario} />
        </span>
      </summary>
      <div className={styles.scenarioBody}>
        <StepList steps={scenario.steps} />
        <ExamplesTable examples={scenario.examples} />
      </div>
    </details>
  );
}

function Section({ type, scenarios, collapsed, onToggle }) {
  const meta = SECTION_META[type];
  if (!meta || scenarios.length === 0) return null;
  return (
    <div className={styles.section}>
      <button
        className={styles.sectionHeader}
        onClick={onToggle}
        aria-expanded={!collapsed}
      >
        <span className={`${styles.badge} ${styles[meta.badgeClass]}`}>{meta.label}</span>
        <span className={styles.sectionTitle}>{meta.title}</span>
        <span className={styles.sectionCount}>{scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}</span>
        <span className={styles.sectionChevron} aria-hidden="true">{collapsed ? '▶' : '▼'}</span>
      </button>
      {!collapsed && (
        <div className={styles.sectionBody}>
          {scenarios.map((s, i) => <ScenarioCard key={i} scenario={s} />)}
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

function CopyAllButton({ rawGherkin }) {
  const [state, setState] = useState('idle');

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(rawGherkin.trim()).then(() => {
      setState('copied');
      setTimeout(() => setState('idle'), 1800);
    });
  }, [rawGherkin]);

  return (
    <button
      className={`${styles.copyAllBtn} ${state === 'copied' ? styles.copyBtnSuccess : ''}`}
      onClick={handleCopy}
      title="Copy all Gherkin scenarios"
    >
      {state === 'copied' ? '✓ Copied' : 'Copy all'}
    </button>
  );
}

export default function GherkinScenarios({ children }) {
  const rawGherkin = typeof children === 'string' ? children : '';
  const [collapsedSections, setCollapsedSections] = useState({ smoke: true, edge: true, negative: true, other: true });

  const feature = useMemo(() => parseGherkin(rawGherkin), [rawGherkin]);

  const grouped = useMemo(() => {
    const g = { smoke: [], edge: [], negative: [], other: [] };
    for (const s of feature.scenarios) g[getTagType(s.tags)].push(s);
    return g;
  }, [feature.scenarios]);

  const toggleSection = useCallback((type) => {
    setCollapsedSections(prev => ({ ...prev, [type]: !prev[type] }));
  }, []);

  if (!rawGherkin.trim()) return null;

  return (
    <div className={styles.feature}>
      <p className={styles.intro}>
        The scenarios below are written in <strong>Gherkin</strong> — a structured,
        plain-language format used for Behaviour-Driven Development (BDD). Each scenario
        describes a concrete test case derived from the normative requirements of this ADR.
        Scenarios are grouped by <strong>Smoke</strong> (happy path), <strong>Edge</strong> (boundary cases),
        and <strong>Negative</strong> (error handling). Click a section to expand it, then
        expand individual scenarios to see the steps. Use the copy buttons to grab Gherkin
        text for use in your test framework.
      </p>
      <div className={styles.copyAllRow}>
        <CopyAllButton rawGherkin={rawGherkin} />
      </div>
      {['smoke', 'edge', 'negative', 'other'].map(type => (
        <Section
          key={type}
          type={type}
          scenarios={grouped[type]}
          collapsed={!!collapsedSections[type]}
          onToggle={() => toggleSection(type)}
        />
      ))}
    </div>
  );
}
