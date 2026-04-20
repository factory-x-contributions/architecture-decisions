---
name: fx-new-version
description: Cuts a new Docusaurus documentation version. Runs pre-flight build, executes docusaurus docs:version, verifies versioned docs/sidebars/graph-data generation, and runs post-version build. Use when releasing a new documentation version.
---

# New Version

## Step 1: Show current state

1. Read `versions.json` and display the list of existing versions
2. Explain: The current `docs/` directory represents the "Upcoming" (unreleased) version. Cutting a version will snapshot `docs/` into `versioned_docs/version-<label>/`.

---

## Step 2: Determine version label

Ask via AskUserQuestion: "What label should the new version have?"

- Show the current versions and note the naming convention: `YYYY-M` format (e.g., `2026-6`)
- Validate that the label does not already exist in `versions.json`
- Validate that the label is non-empty

---

## Step 3: Pre-flight build

Run `npm run build` to ensure the current docs build cleanly before creating a version snapshot.

If the build fails:
- Report the errors
- Do NOT proceed — a broken version snapshot should not be created
- Ask the user to fix the issues first

---

## Step 4: Cut the version

Run: `npx docusaurus docs:version <label>`

This will:
- Copy `docs/` to `versioned_docs/version-<label>/`
- Copy `sidebars.js` to `versioned_sidebars/version-<label>-sidebars.json`
- Add `<label>` to the front of `versions.json`

---

## Step 5: Verify

1. Read `versions.json` — confirm the new label is at position 0
2. Verify `versioned_docs/version-<label>/` directory exists
3. Verify `versioned_sidebars/version-<label>-sidebars.json` exists

---

## Step 6: Post-version build

Run `npm run build` to verify:
- Versioned docs build correctly
- OpenAPI configs auto-generate versioned entries (via `buildApiConfigs()` in `openapi-configs.js`)
- ADR graph plugin generates `adr-graph-data-<label>.json`
- No broken links across versions

If the build fails, report the errors and ask the user how to proceed. Do NOT automatically roll back.

---

## Step 7: Summary

Display a summary:

```
Version "<label>" created successfully.

Files created:
- versioned_docs/version-<label>/
- versioned_sidebars/version-<label>-sidebars.json

Updated:
- versions.json: [<new>, <previous versions>...]

Build verification: SUCCESS / FAILED (details)
```

---

## Important

- Do NOT cut a version if the pre-flight build fails
- The version label convention in this repo is `YYYY-M` (e.g., `2026-3`, `2025-12`) — suggest this format
- After versioning, `docs/` continues to represent the "Upcoming" version — it is NOT cleared
- Do NOT manually edit `versions.json` — let the Docusaurus CLI manage it
- If the post-version build fails, present the errors and let the user decide how to proceed — do NOT auto-roll back
- Do NOT ask for confirmation on individual steps — only at version label selection
