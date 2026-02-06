# Deployment Guide

## Cloudflare Pages Deployment

### Option 1: Deploy via Wrangler CLI

1. **Install Wrangler** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Create a Cloudflare Pages project**:
   ```bash
   wrangler pages project create perforated-panel-designer
   ```

4. **Set environment variables**:
   ```bash
   wrangler pages secret put ADMIN_USERNAME
   wrangler pages secret put ADMIN_PASSWORD
   ```
   Or set them in the Cloudflare Dashboard:
   - Go to Pages → Your Project → Settings → Environment Variables
   - Add `ADMIN_USERNAME` and `ADMIN_PASSWORD`

5. **Deploy**:
   ```bash
   wrangler pages deploy .
   ```

### Option 2: Deploy via GitHub

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/perforated-panel-designer.git
   git push -u origin master
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to Pages → Create a project
   - Connect your GitHub repository
   - Set build settings:
     - Build command: (leave empty)
     - Build output directory: `.`
   - Add environment variables:
     - `ADMIN_USERNAME`: Your admin username
     - `ADMIN_PASSWORD`: Your admin password

3. **Deploy**: Cloudflare will automatically deploy on every push

## Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project

2. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (optional)

3. **Create Firestore Database**:
   - Go to Firestore Database
   - Create database in test mode
   - Add security rules (see README.md)

4. **Get Firebase Config**:
   - Go to Project Settings → General
   - Scroll to "Your apps"
   - Add a web app if you haven't
   - Copy the config object

5. **Update index.html**:
   - Find `const firebaseConfig = { ... }`
   - Replace with your Firebase config values

## Environment Variables

Set these in Cloudflare Pages:

- `ADMIN_USERNAME`: Admin login username (default: "admin")
- `ADMIN_PASSWORD`: Admin login password (change this!)

## Post-Deployment

1. Test authentication flow
2. Test guest downloads (PNG, TXT)
3. Test registered user downloads (all formats)
4. Test admin panel access
5. Verify download tracking
