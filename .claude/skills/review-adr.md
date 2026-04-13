---
name: review-adr
description: Reviews and quality-checks an existing Architecture Decision Record. Validates frontmatter, required sections, cross-references, normative language (RFC 2119), OpenAPI registration, and build integrity. Use when reviewing an ADR before merging.
---

# Review ADR

## Step 1: Identify ADR to review

Try auto-detection first:
1. Run `git diff --name-only main` to find changed ADR files on the current branch
2. If ADR files are found, show them and ask via AskUserQuestion: "Found these ADR changes. Which ADR would you like to review?"
3. If no ADR changes detected, list available ADRs from `docs/hercules_network_adr/` and `docs/hercules_use_case_adr/` and ask the user to select

Determine the ADR type (Network vs Use Case) from the directory path.

---

## Step 2: Frontmatter completeness

Read the ADR's `README.md` and check each field:

- `id` — exists and follows pattern `fx_adrNNN`
- `title` — exists and follows pattern `ADR NNN – <Title>`
- `sidebar_label` — exists
- `description` — exists and is non-empty
- `tags` — exists, is a non-empty array, contains `architecture_decision_records`

Record pass/fail for each field.

---

## Step 3: Section structure

Verify all required sections are present and non-empty.

### Network ADR (check for `###` headers):

- "Problem to be solved"
- "Solution description" (with "**(normative)**" annotation)
- "Context"
- "Expected business consequences"
- "Alternatives evaluated"
- "References"

### Use Case ADR (check for `##` headers):

- "Purpose"
- "Roles"
- "API Structure" (or "API structure")
- "Data Models"
- "Authentication and Authorization"

Flag sections that exist but have no content below the heading.

---

## Step 4: Cross-reference validation

1. Extract all ADR references from the content:
   - Markdown links: `[ADR NNN ...](...)` or `[ADR-NNN ...](...)` patterns
   - Text references: `ADR-NNN`, `ADR NNN`, `ADR_NNN` patterns
2. For each referenced ADR number, verify the directory exists:
   - Check `docs/hercules_network_adr/adr<NNN>-*/`
   - Check `docs/hercules_use_case_adr/adr<NNN>-*/`
3. Report any references to non-existent ADRs as errors

---

## Step 5: Normative language (RFC 2119)

Scan for RFC 2119 keywords: MUST, MUST NOT, SHALL, SHALL NOT, SHOULD, SHOULD NOT, MAY, REQUIRED, RECOMMENDED, OPTIONAL.

- Flag lowercase usage when clearly used normatively (e.g., "must implement" should be "MUST implement")
- For Network ADRs: verify the "Solution description (normative)" section contains at least one normative keyword
- For Use Case ADRs: check that normative language appears in API Structure, Data Models, or Authentication sections

---

## Step 6: OpenAPI verification (Use Case only)

Skip this step for Network ADRs.

1. Check if `resources/` directory exists with OpenAPI YAML files
2. If YAML files exist:
   - Verify basic structure (`openapi`, `info`, `paths` keys present)
   - Check registration in `adrApiRegistry` array in `openapi-configs.js`
   - Verify the `adrPath` and `yamlFileName` match
3. If the README references an OpenAPI spec but no file exists, flag as error
4. If a YAML file exists but is NOT referenced in the README, flag as warning

---

## Step 7: Build verification

Run `npm run build` to catch:
- Broken links (Docusaurus `onBrokenLinks: 'throw'` will fail the build)
- Invalid frontmatter
- OpenAPI generation errors

Report the build outcome. Inform the user before running this step as it may take a moment.

---

## Step 8: Report findings

Present a structured checklist:

```
## ADR Review: ADR <NNN> – <Title>

### Frontmatter
- [x] id: fx_adr<NNN>
- [x] title: present
- [ ] sidebar_label: MISSING
- [x] description: present
- [x] tags: present

### Required Sections
- [x] Purpose
- [x] Roles
- [ ] Data Models: section present but EMPTY
...

### Cross-References
- [x] ADR 002: exists
- [ ] ADR 099: NOT FOUND

### Normative Language
- 12 normative keywords found
- 2 instances of lowercase "must" (line 45, 78) — should be "MUST"

### OpenAPI (if applicable)
- [x] Spec file exists
- [x] Registered in openapi-configs.js
- [x] YAML structure valid

### Build
- [x] npm run build: SUCCESS
```

---

## Important

- Do NOT modify the ADR during review — only report findings
- If the user asks to fix issues, confirm each fix individually before applying
- Be specific about line numbers when reporting problems
- Flag missing `sidebar_label` and `description` as warnings (not errors) since some existing ADRs lack them
- Use the same cross-reference patterns as the ADR graph plugin for consistency
- The build step may take a while — inform the user before running it
