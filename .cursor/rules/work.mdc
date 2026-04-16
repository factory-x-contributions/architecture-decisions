---
name: work
description: Assists with developing and shipping code. Detects uncommitted changes, creates GitHub issues, manages branches, runs human-in-the-loop browser review, and creates pull requests. Use when shipping work or processing the issue backlog.
---

# Work

## Step 1: Detect mode

Check `git status` for uncommitted/untracked changes.

### Case A: Uncommitted changes present
→ Ask the user via AskUserQuestion: "You have uncommitted changes. Ship these as an issue + PR first?"
- **Yes** → Continue with **Ship** (Step 2)
- **No** → Continue with **Work on issues** (Step 3)

### Case B: No uncommitted changes
→ Go directly to **Work on issues** (Step 3)

---

## Step 2: Ship (current work)

Analyze the conversation history and `git diff` to determine which files belong to the current task. Keep in mind there may be uncommitted changes from other parallel tasks — separate cleanly.

Determine the change type:
- `feat` — new feature or functionality
- `fix` — bug fix
- `refactor` — refactoring without behavior change
- `chore` — maintenance, CI, tooling
- `docs` — documentation

Then:

1. **Create issue**: `gh issue create --title "[<type>] <description>" --body "..."`
2. **Create branch**: `git checkout main && git checkout -b <type>/<slug>`
3. **Commit only relevant files**: `git add <files> && git commit -m "<type>: <description>"`
4. **Human-in-the-loop**:
   - Kill all running processes on port 3000/3001: `lsof -ti:3000,3001 | xargs kill -9 2>/dev/null`
   - Start local dev server: `npm start` in background
   - Wait until the server has compiled, then ask the user to review changes in the browser
   - Ask via AskUserQuestion: "Does everything look good? Should the PR be created?"
   - **Yes** → Continue with PR
   - **No / Feedback** → Apply changes, let user review again
5. **Stop dev server**: `lsof -ti:3000,3001 | xargs kill -9 2>/dev/null`
6. **Create PR**: `git push -u origin <type>/<slug> && gh pr create --title "..." --body "... Closes #<issue>"`
7. **Switch back to previous branch**

Afterwards: Ask whether to also work on open issues → If yes, continue with Step 3.

---

## Step 3: Work on issues (backlog)

1. **Load issues**: `gh issue list --state open --limit 50`
2. **Selection**: Show the issues and ask via AskUserQuestion (multiSelect) which ones to work on
3. **Per selected issue**:
   a. Read `gh issue view <number>`
   b. Derive type from issue title (`[feat]` → `feat/`, `[fix]` → `fix/`, etc., default: `feat/`)
   c. `git checkout main && git pull && git checkout -b <type>/<slug>`
   d. Implement and test with `npm run build`
   e. **Human-in-the-loop**:
      - Kill all running processes on port 3000/3001: `lsof -ti:3000,3001 | xargs kill -9 2>/dev/null`
      - Start local dev server: `npm start` in background
      - Wait until the server has compiled, then ask the user to review changes in the browser
      - Ask via AskUserQuestion: "Does everything look good? Should the PR be created?"
      - **Yes** → Continue
      - **No / Feedback** → Apply changes, let user review again
   f. **Stop dev server**: `lsof -ti:3000,3001 | xargs kill -9 2>/dev/null`
   g. `git add <files> && git commit -m "<type>: <description>"`
   h. `git push -u origin <type>/<slug>`
   i. `gh pr create --title "<type>: <description>" --body "... Closes #<issue>"`
   j. Switch back to `main`
   k. **Brief status report** before starting the next issue

---

## Important

- Do NOT ask for confirmation on individual steps — only for mode detection and issue selection
- Keep issue and PR descriptions short and concise
- If an issue is unclear, ask the user before implementing
- Work through issues sequentially — one at a time
