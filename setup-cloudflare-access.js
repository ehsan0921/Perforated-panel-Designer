// Script to help set up Cloudflare access
// Run with: node setup-cloudflare-access.js

console.log(`
╔══════════════════════════════════════════════════════════════╗
║        Cloudflare Access Setup for AI Assistant              ║
╚══════════════════════════════════════════════════════════════╝

To give the AI assistant access to your Cloudflare account, you have two options:

OPTION 1: Create API Token (Recommended)
─────────────────────────────────────────
1. Open this URL in your browser:
   https://dash.cloudflare.com/profile/api-tokens

2. Click "Create Token"

3. Use "Edit Cloudflare Workers" template, OR create custom token with:
   - Account: Cloudflare Pages: Read
   - Account: Cloudflare Pages: Edit
   - Zone: (if needed) Read

4. Copy the generated token

5. Share the token securely with the AI assistant

OPTION 2: Use Wrangler Login (Interactive)
──────────────────────────────────────────
Run this command in your terminal:
   wrangler login

This will open a browser for authentication.
After login, Wrangler will store credentials locally.

Then run:
   wrangler pages project list

This will show your projects and confirm access.

OPTION 3: Share Project Details
────────────────────────────────
If you prefer manual setup, share:
- Your Cloudflare account email
- Project name you want to use
- Preferred subdomain (e.g., perforated-panel.pages.dev)

The AI can then guide you through deployment commands.

═══════════════════════════════════════════════════════════════
`);

// Check if wrangler is installed
const { execSync } = require('child_process');
try {
    execSync('wrangler --version', { stdio: 'ignore' });
    console.log('✓ Wrangler CLI is installed\n');
    console.log('To login, run: wrangler login');
} catch (e) {
    console.log('⚠ Wrangler CLI not found. Install it with:');
    console.log('  npm install -g wrangler\n');
}
