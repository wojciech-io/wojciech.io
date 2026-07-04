// One-time helper: mint a Google Calendar OAuth refresh token for the /meet
// scheduler. Run it locally once, paste the printed refresh token into the
// Cloudflare Pages env. Never commits any secret — reads client id/secret from
// the environment and prints the token to your terminal only.
//
// Prerequisites (Google Cloud Console):
//   1. Enable "Google Calendar API".
//   2. OAuth consent screen: External, add yourself as a test user, then
//      "Publish app" to Production so the refresh token does not expire.
//   3. Credentials → OAuth client ID → Web application, with an authorized
//      redirect URI of exactly:  http://localhost:8788/oauth2callback
//
// Usage:
//   GCAL_CLIENT_ID=... GCAL_CLIENT_SECRET=... node scripts/gcal-mint-token.mjs

import { createServer } from 'node:http';

const CLIENT_ID = process.env.GCAL_CLIENT_ID;
const CLIENT_SECRET = process.env.GCAL_CLIENT_SECRET;
const REDIRECT = 'http://localhost:8788/oauth2callback';
const SCOPE = 'https://www.googleapis.com/auth/calendar';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set GCAL_CLIENT_ID and GCAL_CLIENT_SECRET in the environment first.');
  process.exit(1);
}

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline', // required to receive a refresh_token
    prompt: 'consent', // force a fresh refresh_token every run
  });

console.log('\n1. Open this URL in your browser and approve access:\n');
console.log(authUrl + '\n');
console.log('2. Waiting for the redirect on http://localhost:8788 ...\n');

const server = createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) {
    res.writeHead(404).end();
    return;
  }
  const code = new URL(req.url, 'http://localhost:8788').searchParams.get('code');
  if (!code) {
    res.writeHead(400).end('No code in callback.');
    return;
  }
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT,
        grant_type: 'authorization_code',
      }),
    });
    const data = await tokenRes.json();
    if (!tokenRes.ok || !data.refresh_token) {
      res.writeHead(500).end('Token exchange failed. Check the terminal.');
      console.error('\nToken exchange failed:', JSON.stringify(data, null, 2));
      console.error('\nIf refresh_token is missing, revoke prior access at');
      console.error('https://myaccount.google.com/permissions and run again.');
      server.close();
      return;
    }
    res.writeHead(200, { 'content-type': 'text/plain' }).end('Done. Return to your terminal.');
    console.log('\n✅ Refresh token (set as GCAL_REFRESH_TOKEN in Cloudflare Pages):\n');
    console.log(data.refresh_token + '\n');
    server.close();
  } catch (err) {
    res.writeHead(500).end('Error. Check the terminal.');
    console.error(err);
    server.close();
  }
});

server.listen(8788);
