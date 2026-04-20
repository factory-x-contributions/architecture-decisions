---
name: fx-new-adr
description: Creates a new Architecture Decision Record (ADR) for Factory-X. Interactively gathers type (Network 0xx / Use Case 1xx+), number, title, and metadata, then scaffolds the directory, README.md, and optional OpenAPI spec. Use when adding a new ADR to the documentation.
---

# New ADR

## Step 1: Gather information

Ask the user via AskUserQuestion to collect the following details. Consolidate into as few questions as possible.

1. **Type:** "Is this a Network ADR (0xx) or a Use Case ADR (1xx+)?"

2. **Next available number:** Scan existing directories to find the highest number:
   - Network: `ls docs/hercules_network_adr/` — parse `adrNNN-*` names, find max NNN in 0xx range
   - Use Case: `ls docs/hercules_use_case_adr/` — parse `adrNNN-*` names, find max NNN in 1xx range
   - Propose max+1 (do NOT fill gaps). Let the user override if needed.

3. **Slug:** Short kebab-case name (e.g., `mqtt-over-dsp`, `load-management`)

4. **Title:** Full title without the ADR number prefix (e.g., "Cross-Company Authorization and Discovery")

5. **Description:** One-line description for SEO and metadata

6. **Tags:** Suggest defaults based on type:
   - Network: `[architecture_decision_records, network_adr]`
   - Use Case: `[architecture_decision_records, API]`
   - Let the user add or modify tags.

7. **Version:** Initial version string (e.g., `0.1.0`)

---

## Step 2: Create directory and README.md

Construct the directory path:
- Network: `docs/hercules_network_adr/adr<NNN>-<slug>/`
- Use Case: `docs/hercules_use_case_adr/adr<NNN>-<slug>/`

Zero-pad the number to 3 digits (e.g., `002`, `101`).

Create `README.md` with frontmatter and section skeleton.

### Network ADR README.md

```markdown
---
id: fx_adr<NNN>
title: ADR <NNN> – <Title> Version <ver>
sidebar_label: ADR <NNN> – <Title>
description: ADR <NNN> describes <description>
tags: [<tags>]
---

### Problem to be solved

<!-- Describe the requirements and challenges this ADR addresses -->

### Solution description **(normative)**

<!-- Describe the normative solution using MUST/SHOULD/MAY per RFC 2119 -->

### Context

<!-- Provide background and reasoning -->

### Expected business consequences

<!-- Describe the business implications -->

### Alternatives evaluated

<!-- Describe why other approaches were not chosen -->

### References

<!-- Link to relevant specifications and standards -->
```

### Use Case ADR README.md

Use the template at `templates/use-case-adr.md` as structural basis. Apply the user's input:

```markdown
---
id: fx_adr<NNN>
title: ADR <NNN> – <Title> Version <ver>
sidebar_label: ADR <NNN> – <Title>
description: ADR <NNN> describes <description>
tags: [<tags>]
---

## Purpose

<!-- Describe the use case and its purpose -->

## Roles

<!-- Define Data Provider and Data Consumer roles -->

## API Structure

<!-- Describe required endpoints and services. Reference ADR 008 if applicable. -->

## Data Models

<!-- Define Asset and Submodel requirements -->

## Authentication and Authorization

<!-- Reference ADR 002 and ADR 003 for authentication requirements -->
```

---

## Step 3: OpenAPI scaffold (Use Case only)

Skip this step for Network ADRs.

Ask via AskUserQuestion: "Does this ADR need an OpenAPI specification?"

### If yes:

1. Ask for the service name in kebab-case (e.g., `forecast-service`)

2. Create `docs/hercules_use_case_adr/adr<NNN>-<slug>/resources/<service>-openapi.yaml`:

```yaml
openapi: 3.0.3
info:
  title: <Service Name> API
  version: 1.0.0
  description: API for <description>

paths:
  /example/{id}:
    get:
      summary: Example endpoint
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExampleSchema'

components:
  schemas:
    ExampleSchema:
      type: object
      properties:
        id:
          type: string
```

3. Add entry to the `adrApiRegistry` array in `openapi-configs.js`:

```javascript
{
  configKey: "adr<NNN>-<service>",
  adrPath: "adr<NNN>-<slug>",
  yamlFileName: "<service>-openapi.yaml",
},
```

4. Add an API reference in the README:

```markdown
## API Specification

The service MUST be implemented according to the [OpenAPI specification](./resources/<service>-openapi.yaml).
```

---

## Step 4: Human-in-the-loop review

1. Kill running processes on port 3000/3001: `lsof -ti:3000,3001 | xargs kill -9 2>/dev/null`
2. Start dev server: `npm start` in background
3. Wait until the server has compiled, then ask the user to review in the browser
4. Ask via AskUserQuestion: "Does the new ADR look correct in the browser? Should we proceed?"
   - **Yes** → Continue
   - **No / Feedback** → Apply changes, let user review again
5. Stop dev server: `lsof -ti:3000,3001 | xargs kill -9 2>/dev/null`

---

## Step 5: Build verification

Run `npm run build` to verify no broken links or build errors. Report the outcome.

---

## Important

- Do NOT skip interactive questions — gather all information before creating files
- Always use the exact frontmatter format matching existing ADRs of the same type
- Network ADR sections use `###` headers; Use Case ADR sections use `##` headers
- The `id` field MUST follow the pattern `fx_adrNNN` (zero-padded to 3 digits)
- The directory name MUST follow the pattern `adrNNN-<slug>` (zero-padded to 3 digits)
- Do NOT create `_category_.json` — the sidebar is autogenerated from `dirName`
- If OpenAPI is needed, register it in the `adrApiRegistry` array in `openapi-configs.js`, NOT as a standalone config entry
- Do NOT ask for confirmation on individual file creation steps — only at information gathering and browser review
