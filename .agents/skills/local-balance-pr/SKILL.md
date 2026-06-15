---
name: local-balance-pr
description: Create and publish LOCAL_BALANCE_TRIP_FRONT GitHub issues, issue-number branches, Korean logical commits, and pull requests from the current worktree. Use when the user asks to create an issue, organize or split commits, publish changes, open a PR, or verify automatic labels and author assignees using this repository's issue forms, PR template, and GitHub Actions workflow.
---

# Local Balance PR Publish

Publish the current `LOCAL_BALANCE_TRIP_FRONT` work through the repository's issue, commit, and PR workflow.

## Read First

Read these files completely before acting:

- `.github/ISSUE_TEMPLATE/task.yml`
- `.github/ISSUE_TEMPLATE/bug.yml`
- `.github/pull_request_template.md`
- `.github/workflows/automate-issues-and-prs.yml`
- `references/conventions.md`

Follow the body structures in `references/conventions.md` exactly. Their headings and checked task types are parsed by the automation workflow.

## Workflow

1. Confirm repository context with `git rev-parse --show-toplevel`, `git remote -v`, `git status --short --branch`, and `gh repo view`.
2. Inspect the full diff and separate intended work from unrelated user changes. Never stage unrelated files.
3. Resolve the work type from `references/conventions.md`. Support multiple PR work types when the diff genuinely spans multiple categories.
4. Reuse an existing issue when the current branch begins with its number or the user names one. Otherwise create the issue first.
5. Write the issue body to a temporary Markdown file using the exact task or bug structure in `references/conventions.md`. Keep the `### 작업 유형` heading and mapped value unchanged for task issues.
6. Create the issue with a Korean title matching the repository issue form. For bug issues, explicitly add `🐞 BugFix` because CLI-created bodies do not inherit YAML form metadata.
7. Create or reuse a branch named `{issue-number}-{description-kebab-case}`. Base new work on the GitHub default branch, currently `develop`.
8. Split changes into logical commits. Use Korean Conventional Commit messages in the form `type: 설명`.
9. Run the validation commands required by `references/conventions.md`. Do not mark a PR checklist item complete unless that command passed.
10. Push the current branch with upstream tracking.
11. Write the PR body to a temporary Markdown file from the repository template. Check every applicable work type and link the issue with `closes #<number>`.
12. Open a PR against the GitHub default branch using the linked issue title exactly as the PR title. Default to a ready PR unless the user requests a draft or the work is incomplete.
13. Wait briefly, then verify the issue and PR labels and assignees. The repository workflow should assign the author and synchronize labels.
14. If automation did not reach the required state, inspect the workflow run. Fall back to `gh issue edit` or `gh pr edit` only when the workflow is unavailable, failed, or permissions prevented the update.

## Safety Rules

- Check `gh auth status` before GitHub writes.
- Do not create duplicate issues or PRs. Search by current branch, issue number, and title first.
- Do not use `git add -A` in a mixed worktree. Stage explicit paths.
- Do not rewrite published history unless the user explicitly requests it. If required, use `git push --force-with-lease`, never plain `--force`.
- Do not claim automatic labels or assignees succeeded until GitHub confirms them.
- Preserve user changes outside the publishing scope.
- Use temporary files for generated issue and PR bodies; do not add them to the repository.

## Tool Preference

- Use local `git` for branch, staging, commit, and push operations.
- Prefer the GitHub app for structured issue and PR reads or creation when available.
- Use `gh` for authentication, branch-associated PR discovery, labels, assignees, Actions runs, and any connector gaps.
- When network access is blocked, request approval and continue rather than stopping at a plan.

## Final Report

Report:

- issue URL and selected work type
- branch name
- commit SHAs and messages
- validation commands and results
- PR URL and base branch
- final issue and PR labels
- final issue and PR assignees
- any automation failure or fallback used
