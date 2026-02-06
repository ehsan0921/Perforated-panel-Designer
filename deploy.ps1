# Cloudflare Pages Deployment Script
# Run this script to deploy to Cloudflare Pages

Write-Host "🚀 Deploying Perforated panel Designer to Cloudflare Pages..." -ForegroundColor Green

# Check if wrangler is installed
try {
    $wranglerVersion = wrangler --version
    Write-Host "✓ Wrangler found: $wranglerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Wrangler not found. Installing..." -ForegroundColor Red
    npm install -g wrangler
}

# Check authentication
Write-Host "`nChecking authentication..." -ForegroundColor Yellow
$authCheck = wrangler whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Not authenticated. Please run: wrangler login" -ForegroundColor Yellow
    Write-Host "Or set CLOUDFLARE_API_TOKEN environment variable" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Authenticated" -ForegroundColor Green

# Create project if it doesn't exist
Write-Host "`nCreating/Updating Cloudflare Pages project..." -ForegroundColor Yellow
try {
    wrangler pages project create perforated-panel-designer --production-branch master 2>&1 | Out-Null
    Write-Host "✓ Project ready" -ForegroundColor Green
} catch {
    Write-Host "ℹ Project may already exist, continuing..." -ForegroundColor Cyan
}

# Deploy
Write-Host "`nDeploying to Cloudflare Pages..." -ForegroundColor Yellow
wrangler pages deploy . --project-name=perforated-panel-designer

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "Your app should be available at: https://perforated-panel-designer.pages.dev" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Deployment failed. Check errors above." -ForegroundColor Red
}
