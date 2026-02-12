# Email (Mailgun) – Variables and Secrets

The Email feature uses **Cloudflare Pages Variables and Secrets** so your Mailgun API key and sender details are never in the frontend code.

## Set in Cloudflare Dashboard

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → your project **perforated-panel-designer**.
2. Go to **Settings** → **Variables and Secrets**.
3. Under **Environment variables** (or **Encrypted variables** for the API key), add:

| Name | Value | Encrypted (Secret) |
|------|--------|---------------------|
| `MAILGUN_API_KEY` | *(your Mailgun API key from dashboard)* | **Yes** (recommended) |
| `MAILGUN_DOMAIN` | `ehsanmo.me` | No |
| `MAILGUN_FROM_EMAIL` | `ppd.ehsanmo.me@ehsanmo.me` | No |

4. Save. Redeploy the project if needed so the new variables are picked up.

## Set via Wrangler (optional)

From the project root:

```bash
# Secret (encrypted) – use for the API key
wrangler pages secret put MAILGUN_API_KEY --project-name=perforated-panel-designer

# Plain variables
wrangler pages secret put MAILGUN_DOMAIN --project-name=perforated-panel-designer
wrangler pages secret put MAILGUN_FROM_EMAIL --project-name=perforated-panel-designer
```

For plain variables you can use the dashboard or `wrangler.toml` / Pages settings; for the API key, prefer **Encrypted** (Secrets).

## After adding variables

Redeploy the site (e.g. **Deployments** → **Create deployment** or push to git) so the Function sees the new env vars.
