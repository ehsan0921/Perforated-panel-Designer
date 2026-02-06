# Deployment Instructions

## Step 1: Provide Firebase Configuration

Before deploying, I need your Firebase config. Please provide these 6 values:

1. `apiKey`
2. `authDomain` 
3. `projectId`
4. `storageBucket`
5. `messagingSenderId`
6. `appId`

You can find them in Firebase Console → Project Settings → Your apps → Web app config.

## Step 2: Authentication

Run this command to authenticate with Cloudflare:
```powershell
wrangler login
```

This will open a browser for OAuth authorization.

## Step 3: Deploy

Once authenticated and Firebase config is provided, run:
```powershell
.\deploy.ps1
```

Or manually:
```powershell
wrangler pages project create perforated-panel-designer
wrangler pages deploy . --project-name=perforated-panel-designer
```

## Step 4: Set Environment Variables

After deployment, set these in Cloudflare Pages Dashboard:
- Go to Pages → Your Project → Settings → Environment Variables
- Add:
  - `ADMIN_USERNAME`: admin
  - `ADMIN_PASSWORD`: AdminEhsan092161!@#

## Current Status

✅ Project structure ready
✅ Cloudflare Pages config ready
✅ Admin credentials configured in _wrangler.toml
⏳ Waiting for: Firebase config and Cloudflare authentication
