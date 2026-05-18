# 11 - Git and Cloudflare operations

## Repository

- GitHub: `https://github.com/wojciechluszczynski/wojciech-io` (private)
- Local path: `~/wojciech.io`
- Default branch: `main`
- Cloudflare Pages staging: `https://wojciech-io.pages.dev`
- Production: `https://wojciech.io` (custom domain in CF Pages)

## Branch strategy

- `main` → production deploy (Cloudflare Pages auto-deploy)
- `claude/*` → worktree branches created by Claude Code sessions. Remove after merge.
- Feature branches: `feat/<name>` or `fix/<name>`. Open PR → merge → delete.

Only one `claude/*` branch should exist at a time (the active session).

### Cleanup worktrees after a Claude session

```bash
git worktree list                              # see all worktrees
git worktree remove --force .claude/worktrees/<name>
git branch -D claude/<name>
```

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
| app.wojciech.io | Vercel | separate repo (Next.js) |
| subscribe.wojciech.io | Beehiiv | external service |
| academy.wojciech.io | external | external service |
| notch.wojciech.io | Vercel | separate repo |

Migration of app.wojciech.io to Cloudflare is planned (separate sprint).
