# 11 - Git and Cloudflare operations

## Repository

- GitHub: `https://github.com/wojciechluszczynski/wojciech-io` (private)
- Local path: `~/wojciech.io`
- Default branch: `main`
- Cloudflare Pages staging: `https://wojciech-io.pages.dev`
- Production: `https://wojciech.io` (custom domain in CF Pages)

## Branch strategy and contributor workflow

### The rule: nothing goes directly to `main`

`main` deploys to production automatically. Every change — whether from Wojciech, Claude Code, or Codex — must go through a branch and be merged via GitHub PR.

### Branch naming by source

| Who | Prefix | Example |
|---|---|---|
| Claude Code (hello@) | `claude/` | `claude/serene-joliot-904970` (auto-generated) |
| Claude Code (w.luszczynski@) | `claude/` | same auto pattern |
| Codex (either account) | `codex/` | `codex/fix-footer-links` |
| Wojciech manually | `feat/` or `fix/` | `feat/work-page-redesign` |

Claude Code creates branches automatically via worktrees — no manual naming needed.  
Codex should be configured to use `codex/<short-description>` as the branch prefix.

### Two-account model (hello@ and w.luszczynski@)

Both accounts push to the same repo. To avoid conflicts:

- Work on different branches at the same time — never on the same branch simultaneously.
- If both sessions touch the same file, the second merge will need to resolve conflicts. This is expected — resolve in the PR, not locally.
- After any session ends: merge or close the branch. Do not leave long-lived feature branches — they accumulate drift.
- git author identity: make sure both accounts have correct `user.email` set in their git config. GitHub matches the email to the account for attribution.

### Merge and cleanup

After a branch is merged:
1. Delete the branch on GitHub (GitHub shows a "Delete branch" button after merge).
2. If it was a Claude Code worktree, also remove it locally:

```bash
git worktree list
git worktree remove --force .claude/worktrees/<name>
git branch -D claude/<name>
```

### Commit message convention

```
feat: add insights tag color system
fix: correct Polish diacritics in footer
ops: update CI workflow
content: add new insight on GTM agent architecture
```

Prefix options: `feat`, `fix`, `ops`, `content`, `refactor`, `docs`.

## Deployment

Cloudflare Pages deploys automatically on push to `main`. No manual steps needed.

Branch preview deployments are enabled for `claude/**` branches — each gets a URL at `https://<branch-hash>.wojciech-io.pages.dev`.

For Terraform-managed config see `terraform/README.md`.

## Routine commands

### Start local dev

```bash
cd ~/wojciech.io
npm run dev
```

### Save work and deploy

```bash
git add <files>
git commit -m "feat: describe the change"
git push                # triggers CF Pages deploy on main
```

### Feature branch workflow

```bash
git checkout -b feat/my-change
# ... make changes ...
git add .
git commit -m "feat: describe the change"
git push -u origin feat/my-change
# open PR on GitHub → merge → delete branch
```

## CI

`.github/workflows/ci.yml` runs on every push and PR:
- `npm ci` + `npm run build` — verifies the Astro build passes
- Uploads `dist/` artifact on main merges (7-day retention)

## Security

- `.github/CODEOWNERS`: all files owned by `@wojciechluszczynski`
- Branch protection on `main`: **requires GitHub Pro** (repo is private on free plan). Re-enable when upgrading or making repo public.
- Cloudflare API tokens: use scoped tokens (Pages:Edit + DNS:Edit for wojciech.io zone only). Never use the Global API key.

## Cloudflare IaC (Terraform)

Config lives in `terraform/`. Manages: Pages project, branch deploy rules, custom domain.

See `terraform/README.md` for first-time setup and import instructions.

Do not use `wrangler deploy` — this is a static Astro site on Cloudflare Pages, not Workers.

## Ecosystem subdomains

| Subdomain | Platform | Repo / source |
|---|---|---|
| wojciech.io | Cloudflare Pages | this repo |
| app.wojciech.io | Cloudflare Pages | this repo, `apps/app` |
| subscribe.wojciech.io | Cloudflare Pages | this repo, `apps/subscribe` direct upload |
| academy.wojciech.io | Cloudflare Pages | this repo, `apps/academy` direct upload to `akademia-wojciech-io` |
| notch.wojciech.io | Cloudflare Pages | this repo, `apps/notch` direct upload |
| gh.wojciech.io | Cloudflare Pages | this repo, `apps/growthhub` direct upload |

Older standalone repos for app/subscribe/notch are archived or kept only as rollback context.
