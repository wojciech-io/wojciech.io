// The two emails of the Woody waiting list: the one that asks the person to confirm the address, and the one that says they are on the list already.
// Plain tables and inline styles (mail programs ignore the rest), a banner picture that lives on the Woody page (JPEG, because mail programs do not show WebP), a headline in a
// serif that every system has, and a plain text part for the programs that show no pictures. No dashes in the copy (docs/10-tone-of-voice.md).

const BANNER = 'https://wojciech.io/woody/img/mail-woody.jpg';
const PAGE = 'https://wojciech.io/woody/';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function layout({ title, preheader, headline, paragraphs, button, small }: {
  title: string; preheader: string; headline: string; paragraphs: string[]; button?: { label: string; url: string }; small: string[];
}): string {
  const body = paragraphs.map((p) => `<p style="margin: 0 0 16px; font-size: 17px; line-height: 1.6; color: #2A303B;" class="email-text">${esc(p)}</p>`).join('\n');
  const cta = button
    ? `<table cellpadding="0" cellspacing="0" role="presentation" style="margin: 28px 0 8px;"><tr><td style="border-radius: 999px; background-color: #FF4D2E;"><a href="${esc(button.url)}" style="display: inline-block; padding: 16px 30px; border-radius: 999px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 700; color: #0C0F14; text-decoration: none;">${esc(button.label)}</a></td></tr></table>`
    : '';
  const fine = small.map((p) => `<p style="margin: 0 0 10px; font-size: 13.5px; line-height: 1.55; color: #6A7385;" class="email-muted">${esc(p)}</p>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${esc(title)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F4F5F7; }
    a { color: inherit; }
    @media (max-width: 520px) { .pad { padding: 28px 22px !important; } .headline { font-size: 28px !important; } }
    @media (prefers-color-scheme: dark) {
      body, .email-bg { background-color: #0C0F14 !important; }
      .email-card { background-color: #151A22 !important; }
      .email-text { color: #DDE1E8 !important; }
      .email-head { color: #FFFFFF !important; }
      .email-muted { color: #9AA3B2 !important; }
    }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #F4F5F7; opacity: 0;">${esc(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-bg" style="background-color: #F4F5F7; padding: 32px 14px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px;">
          <tr><td style="padding: 0 4px 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #0C0F14;" class="email-head">woody</td></tr>
          <tr>
            <td class="email-card" style="background-color: #FFFFFF; border-radius: 22px; overflow: hidden;">
              <a href="${PAGE}" style="display: block;"><img src="${BANNER}" width="600" alt="Woody the forester plants a pine" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0;" /></a>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="pad" style="padding: 36px 40px 34px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
                    <h1 class="headline email-head" style="margin: 0 0 18px; font-family: Georgia, 'Times New Roman', serif; font-size: 34px; line-height: 1.12; font-weight: 700; color: #0C0F14;">${esc(headline)}</h1>
                    ${body}
                    ${cta}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 22px 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
              ${fine}
              <p style="margin: 0; font-size: 13.5px; line-height: 1.55; color: #6A7385;" class="email-muted">Wojciech Luszczynski · <a href="${PAGE}" style="color: #A8331E;">wojciech.io/woody</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const CONFIRM = {
  subject: 'One click and you are on the Woody list',
  headline: 'One click, and you are on the list.',
  preheader: 'Press the button so I know this address is yours. I write once, when Woody opens.',
  paragraphs: [
    'You asked to hear when Woody opens. Press the button below, so I know this address is yours.',
    'I write once, on the day Woody opens. I send no newsletter and I share your address with nobody.',
  ],
  button: 'Confirm my place',
  small: ['If you did not ask for this, ignore this email. Nothing happens, and the link stops working in 24 hours.'],
};

const ALREADY = {
  subject: 'You are already on the Woody list',
  headline: 'You are already on the list.',
  preheader: 'Nothing to do. I write once, when Woody opens.',
  paragraphs: [
    'Someone, most likely you, asked to join the Woody list with this address. It is on the list already, so there is nothing to do.',
    'I write once, on the day Woody opens, and send no newsletter.',
  ],
  small: ['If this was not you, ignore this email.'],
};

export function woodyConfirmationEmail({ confirmUrl }: { confirmUrl: string }) {
  return {
    subject: CONFIRM.subject,
    html: layout({ title: CONFIRM.subject, preheader: CONFIRM.preheader, headline: CONFIRM.headline, paragraphs: CONFIRM.paragraphs, button: { label: CONFIRM.button, url: confirmUrl }, small: CONFIRM.small }),
    text: [CONFIRM.headline, '', ...CONFIRM.paragraphs.flatMap((p) => [p, '']), `${CONFIRM.button}: ${confirmUrl}`, '', ...CONFIRM.small, '', `Wojciech Luszczynski, ${PAGE}`].join('\n'),
  };
}

export function woodyAlreadyEmail() {
  return {
    subject: ALREADY.subject,
    html: layout({ title: ALREADY.subject, preheader: ALREADY.preheader, headline: ALREADY.headline, paragraphs: ALREADY.paragraphs, small: ALREADY.small }),
    text: [ALREADY.headline, '', ...ALREADY.paragraphs.flatMap((p) => [p, '']), ...ALREADY.small, '', `Wojciech Luszczynski, ${PAGE}`].join('\n'),
  };
}
