# Branch Protection Recommendation

Use this policy on branch `main` to require automated quality gates.

## Recommended Rules
- Require a pull request before merging.
- Require approvals: at least `1`.
- Dismiss stale pull request approvals when new commits are pushed.
- Require conversation resolution before merging.
- Require status checks to pass before merging.
- Require branches to be up to date before merging.
- Do not allow force pushes.
- Do not allow deletions.

## Required Status Checks
Add these checks from workflow `Test Web`:
- `smoke`
- `full`

## Why
- `smoke` keeps PR feedback fast for core user journeys.
- `full` enforces deeper E2E coverage (admin + comment/vote lifecycle).
- Both checks reduce regressions before merge.

## Optional CLI (GitHub CLI)
Replace placeholders before running.

```bash
gh api \
  -X PUT \
  repos/Muensaen/Agenthub/branches/main/protection \
  -f required_status_checks.strict=true \
  -F required_status_checks.contexts[]='smoke' \
  -F required_status_checks.contexts[]='full' \
  -f enforce_admins=true \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f restrictions=
```

## PowerShell API Script (included)
This repository also includes:

- `scripts/set-branch-protection.ps1`

Usage:

```powershell
$env:GITHUB_TOKEN = "<ADMIN_PAT_WITH_repo_scope>"
powershell -ExecutionPolicy Bypass -File scripts/set-branch-protection.ps1 -Repo "Muensaen/Agenthub" -Branch "main"
```
