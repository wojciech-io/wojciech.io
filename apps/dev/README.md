# dev.wojciech.io — operations dashboard

Internal-only static Astro dashboard for monitoring the wojciech.io operations surface.

## Deploy prerequisites (Wojciech action — Sprint 1 close)

This project ships code but does NOT deploy until the following are in place:

1. **Cloudflare Access policy** for `dev.wojciech.io`:
   - Identity provider: Google OAuth
   - Required factor: WebAuthn (passkey)
   - Allow list: owner account only
   - Session: 24h

2. **DNS record** `dev.wojciech.io`:
   - CNAME → `wojciech-io-dev.pages.dev` (proxied — orange cloud ON)
   - Add this AFTER the CF Pages project exists (step 3).

3. **CF Pages project** `wojciech-io-dev`:
   - Deploy via the Wrangler GitHub Actions workflow from `wojciech-io/wojciech.io`
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

The dashboard is static and intentionally contains no private state.

## Roadmap (Sprint 2)

- Live PR + Issue feed via GitHub API (currently just deep-links)
- Private incident/review note stream
- Decision queue (items waiting on Wojciech ACK)
- Deploy outcome history (last 7d)
- Lighthouse trend graphs

## Security posture

- No client-side JS that can leak data
- No third-party scripts
- `noindex,nofollow` meta + `User-agent: * Disallow: /` robots.txt
- Behind Cloudflare Access — even an Access policy misconfig should not expose data because the build artifact has no secrets or private state.
