# dev.wojciech.io — agent operations dashboard

Internal-only static Astro dashboard for monitoring the wojciech.io agent fleet. Reads `.agent-state/<agent>/state.md` at BUILD time.

## Deploy prerequisites (Wojciech action — Sprint 1 close)

This project ships code but does NOT deploy until the following are in place:

1. **Cloudflare Access policy** for `dev.wojciech.io`:
   - Identity provider: Google OAuth
   - Required factor: WebAuthn (passkey)
   - Allow list: `w.luszczynski@gmail.com` only
   - Session: 24h
   - See in-chat instructions delivered 2026-05-22, or `docs/security/access-policy.md`.

2. **DNS record** `dev.wojciech.io`:
   - CNAME → `wojciech-io-dev.pages.dev` (proxied — orange cloud ON)
   - Add this AFTER the CF Pages project exists (step 3).

3. **CF Pages project** `wojciech-io-dev`:
   - Connect to `wojciechluszczynski/wojciech-io` repo
   - Production branch: `main`
   - Build command: `npm run build:dev`
   - Build output directory: `apps/dev/dist`
   - Root directory: `/`
   - Environment variables: none required for v1

4. **Custom domain** attached to CF Pages project:
   - In project Settings → Custom domains → Add `dev.wojciech.io`
   - CF will auto-issue cert + activate the Access policy

## Local dev

```bash
cd apps/dev
npm install
npm run dev    # http://localhost:4329
```

The dashboard reads `../../.agent-state/` at build time, so any state.md change
shows up after `npm run build` + reload.

## Roadmap (Sprint 2)

- Live PR + Issue feed via GitHub API (currently just deep-links)
- `.agent-reports/` stream
- Decision queue (items waiting on Wojciech ACK)
- Deploy outcome history (last 7d)
- Lighthouse trend graphs

## Security posture

- No client-side JS that can leak data
- No third-party scripts
- `noindex,nofollow` meta + `User-agent: * Disallow: /` robots.txt
- Behind Cloudflare Access — even an Access policy misconfig should not expose data (build artifact has no secrets, just public GitHub repo info + agent state markdown)
