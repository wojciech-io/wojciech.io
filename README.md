# wojciech.io

Public portfolio for Wojciech Luszczynski, built with Astro and deployed on Cloudflare Pages.

## Local work

```sh
npm install
npm run dev
npm run build
```

## Deployment

Cloudflare Pages builds from `main`.

```sh
git add -A
git commit -m "Describe the change"
git push origin main
```

## Related surfaces

- `https://wojciech.io` - public portfolio, writing, work, contact
- `https://app.wojciech.io` - app workspace, CV, stack, timeline
- `https://subscribe.wojciech.io` - newsletter product, separate deployment
- `https://notch.wojciech.io` - Notch product site, separate deployment

## Newsletter subscriptions

The main site's `/api/subscribe` proxies to the Cloudflare Pages subscription
app in `apps/subscribe`. Confirmation saves a global Resend contact using
`RESEND_API_KEY`; no audience setting is required. A failed Resend or consent
write keeps the pending token available for retry and does not report success.
Existing confirmed contacts do not receive another welcome message.

Build and deploy the subscription app from `apps/subscribe` so Wrangler bundles
its own functions, not the main site's proxy functions. The newsletter sender
synchronizes active Resend contacts before sending, including manual additions.
