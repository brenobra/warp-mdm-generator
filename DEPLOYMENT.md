# Deployment Guide

## Prerequisites

1. Cloudflare account
2. Domain configured in Cloudflare (cflab.one)
3. Wrangler CLI installed: `npm install -g wrangler`

## Step-by-Step Deployment to mdm.cflab.one

### 1. Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window for authentication.

### 2. Build the Project

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

### 3. Deploy to Cloudflare Workers

```bash
npx wrangler deploy
```

This will:
- Upload your worker code
- Deploy static assets from `dist/`
- Provide a workers.dev URL (e.g., `warp-mdm-generator.your-subdomain.workers.dev`)

### 4. Configure Custom Domain

#### Option A: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Select your **warp-mdm-generator** worker
4. Go to **Settings** → **Domains & Routes**
5. Click **Add Custom Domain**
6. Enter: `mdm.cflab.one`
7. Click **Add Domain**

Cloudflare will automatically:
- Create DNS records
- Set up SSL/TLS certificates
- Configure routing

#### Option B: Via Wrangler Config

1. Uncomment the routes section in `wrangler.toml`:

```toml
[[routes]]
pattern = "mdm.cflab.one"
custom_domain = true
```

2. Deploy again:

```bash
npx wrangler deploy
```

### 5. Verify Deployment

Visit `https://mdm.cflab.one` in your browser. You should see the WARP MDM Generator.

## Environment Variables

This project doesn't require any environment variables. All configuration is client-side.

## Troubleshooting

### Issue: Domain not resolving

**Solution:** Wait 1-2 minutes for DNS propagation, or check:
1. DNS records are correct in Cloudflare dashboard
2. Proxy status is enabled (orange cloud)
3. SSL/TLS is set to "Full" or "Full (strict)"

### Issue: 404 errors on routes

**Solution:** The worker handles SPA routing automatically. If you get 404s:
1. Check `worker.js` is correctly configured
2. Ensure `assets.directory` points to `./dist`
3. Redeploy with `npx wrangler deploy`

### Issue: Build fails

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Updating the Deployment

1. Make your changes
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy: `npx wrangler deploy`

## Rolling Back

To rollback to a previous version:

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. Click **Deployments**
4. Find the previous working deployment
5. Click **Rollback**

## Monitoring

View logs and analytics:

```bash
# View real-time logs
npx wrangler tail

# View in dashboard
# Go to Workers & Pages → warp-mdm-generator → Analytics
```

## Cost

Cloudflare Workers Free Tier includes:
- 100,000 requests/day
- 10ms CPU time per request
- Static asset hosting

For this project, free tier should be sufficient for typical usage.

## Security

This tool:
- ✅ Runs entirely client-side (no data sent to server)
- ✅ No backend database or storage
- ✅ HTTPS enforced by Cloudflare
- ✅ No cookies or tracking
- ✅ No external dependencies loaded at runtime

## Support

- **Issues:** GitHub Issues
- **Documentation:** [README.md](./README.md)
- **Cloudflare Docs:** https://developers.cloudflare.com/workers/
