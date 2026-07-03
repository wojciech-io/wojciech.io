interface ConfirmationEmailProps {
  email: string;
  confirmUrl: string;
}

export function confirmationEmail({ email, confirmUrl }: ConfirmationEmailProps): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Confirm your AI Espresso subscription</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #f4f3ef; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: inherit; }
    @media (prefers-color-scheme: dark) {
      body, .email-bg { background-color: #141009 !important; }
      .email-card { background-color: #1c1710 !important; border-color: #2c2418 !important; }
      .email-text { color: #f4f0e7 !important; }
      .email-muted { color: #999180 !important; }
      .email-divider { border-color: #2c2418 !important; }
      .pill { border-color: #3c3322 !important; background-color: #221c12 !important; color: #999180 !important; }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-bg" style="background-color: #f4f3ef; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 520px;">

          <!-- Header: wordmark -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color: #fffefb; border: 1px solid #dcdbd3; border-radius: 999px; padding: 6px 12px;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align: middle;"><img src="https://wojciech.io/images/ai-espresso-cup.png" width="18" height="18" alt="" style="display: block; border-radius: 6px;" /></td>
                        <td style="width: 8px;"></td>
                        <td style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #080808; vertical-align: middle;">AI Espresso</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="email-card" style="background-color: #fffefb; border: 1px solid #dcdbd3; border-radius: 8px; overflow: hidden;">

              <!-- Card top accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="height: 3px; background-color: #eaff00;"></td>
                </tr>
              </table>

              <!-- Card body -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding: 40px 40px 32px;">

                <!-- Headline -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <p style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.16em; color: #74746e; margin-bottom: 12px;">One step left</p>
                    <h1 class="email-text" style="font-size: 28px; font-weight: 600; line-height: 1.15; letter-spacing: -0.02em; color: #080808;">
                      Confirm your subscription
                    </h1>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td class="email-divider" style="border-top: 1px solid #dcdbd3; padding-bottom: 24px;"></td>
                </tr>

                <!-- Body copy -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <p class="email-muted" style="font-size: 15px; line-height: 1.65; color: #343430; margin-bottom: 12px;">
                      You asked to subscribe to <strong class="email-text" style="color: #080808; font-weight: 600;">AI Espresso</strong>, short operator notes on AI systems, GTM architecture, and what I'm building.
                    </p>
                    <p class="email-muted" style="font-size: 15px; line-height: 1.65; color: #343430;">
                      Click the button below to confirm <strong style="color: inherit;">${email}</strong> and get the next issue.
                    </p>
                  </td>
                </tr>

                <!-- CTA button -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="background-color: #eaff00; border-radius: 7px;">
                          <a href="${confirmUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #0c0c0c; text-decoration: none; letter-spacing: -0.01em;">
                            Confirm subscription →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Fallback link -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <p style="font-size: 12px; color: #74746e; line-height: 1.6;">
                      Button not working? Copy and paste this link into your browser:<br />
                      <a href="${confirmUrl}" style="color: #596400; word-break: break-all; text-decoration: underline;">${confirmUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td class="email-divider" style="border-top: 1px solid #dcdbd3; padding-bottom: 20px;"></td>
                </tr>

                <!-- Signature: the person behind the espresso -->
                <tr>
                  <td style="padding-bottom: 8px;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align: middle;">
                          <img src="https://wojciech.io/images/wojciech-avatar-warm.webp" width="40" height="40" alt="Wojciech Łuszczyński" style="display: block; border-radius: 50%; border: 1px solid #dcdbd3;" />
                        </td>
                        <td style="width: 12px;"></td>
                        <td style="vertical-align: middle;">
                          <p class="email-text" style="font-size: 14px; font-weight: 600; color: #080808; line-height: 1.3;">Wojciech Łuszczyński</p>
                          <p class="email-muted" style="font-size: 12px; color: #74746e; line-height: 1.4;">AI Espresso · a day of AI, in one sip</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="font-size: 12px; color: #74746e; line-height: 1.6;">
                Sent by <a href="https://wojciech.io" style="color: #343430; font-weight: 500; text-decoration: none;">Wojciech Łuszczyński</a>
                &nbsp;·&nbsp;
                <a href="mailto:hello@wojciech.io" style="color: #343430; text-decoration: none;">hello@wojciech.io</a>
              </p>
              <p style="font-size: 11px; color: #74746e; margin-top: 6px;">
                If you didn't sign up for this, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
