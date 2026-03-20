# GroundVault — AI Interaction Guidelines

## Communication

- Be concise and direct.
- Explain non-obvious decisions briefly.
- Ask before large refactors or architectural changes.
- Don't add features not in the project spec.
- Never delete files without explicit confirmation.

## Workflow

Follow this workflow for **every** feature or fix:

1. **Document** — Write up the feature/fix in `context/current-feature.md`.
2. **Branch** — Create a new branch (see Branching below).
3. **Implement** — Build the feature/fix as documented.
4. **Test** — Verify in the browser. Run `npm run build` and fix any errors. (Unit tests will be added later.)
5. **Iterate** — Adjust as needed based on feedback.
6. **Commit** — Only after the build passes and everything works. Ask before committing.
7. **Merge** — Merge to `main`.
8. **Delete Branch** — Delete the branch after merge.
9. **Review** — Review AI-generated code (see Code Review below).
10. **Close** — Mark as completed in `context/current-feature.md` and add to history.

**Do NOT commit until the build passes. If the build fails, fix the issues first.**

## Branching

Create a new branch for every feature or fix:

- Features: `feature/[name]`
- Fixes: `fix/[name]`
- Chores: `chore/[name]`

Ask to delete the branch once merged.

## Commits

- Ask before committing — never auto-commit.
- Use conventional commit messages: `feat:`, `fix:`, `chore:`, `refactor:`, etc.
- Keep commits focused — one feature or fix per commit.
- Never include "Generated with Claude" or similar in commit messages.

## When Stuck

- If something isn't working after 2–3 attempts, **stop and explain the issue**.
- Don't keep trying random fixes.
- Ask for clarification if requirements are unclear.

## Code Changes

- Make minimal changes to accomplish the task.
- Don't refactor unrelated code unless asked.
- Don't add "nice to have" features.
- Preserve existing patterns in the codebase.

## Code Review

Review AI-generated code periodically, especially for:

- **Security** — auth checks, input validation, exposed secrets.
- **Performance** — unnecessary re-renders, N+1 queries, missing indexes.
- **Logic** — edge cases, off-by-one errors, null handling.
- **Consistency** — matches existing codebase patterns and coding standards.
