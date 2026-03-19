import { EnvConfigError } from "./env";

function getMailgunConfig() {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM || `noreply@${domain}`;
  const apiUrl = process.env.MAILGUN_API_URL || "https://api.mailgun.net";
  const bcc = process.env.MAILGUN_BCC || "";

  const missing: string[] = [];
  if (!apiKey) missing.push("MAILGUN_API_KEY");
  if (!domain) missing.push("MAILGUN_DOMAIN");

  if (missing.length > 0) {
    throw new EnvConfigError(
      missing,
      `Mailgun is required when EMAIL_CONFIRMATION_ENABLED=true. Missing: ${missing.join(", ")}`
    );
  }

  return { apiKey: apiKey!, domain: domain!, from, apiUrl, bcc };
}

export async function sendVerificationEmail(to: string, code: string) {
  const { apiKey, domain, from, apiUrl, bcc } = getMailgunConfig();

  const form = new URLSearchParams();
  form.append("from", from);
  form.append("to", to);
  if (bcc) form.append("bcc", bcc);
  form.append("subject", "Your verification code");
  form.append(
    "text",
    `Your verification code is: ${code}\n\nThis code expires in 10 minutes.`
  );
  form.append(
    "html",
    `<div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 24px;">
  <h2 style="margin: 0 0 16px;">Verify your email</h2>
  <p style="color: #555; margin: 0 0 24px;">Enter this code to complete your registration:</p>
  <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #f5f5f5; border-radius: 8px;">${code}</div>
  <p style="color: #888; font-size: 13px; margin: 24px 0 0;">This code expires in 10 minutes.</p>
</div>`
  );

  const res = await fetch(`${apiUrl}/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
    },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mailgun API error (${res.status}): ${body}`);
  }
}
