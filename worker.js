/**
 * Cloudflare Worker entry point for serving static assets
 */
export default {
  async fetch(request, env) {
    // Serve static assets from the ASSETS binding
    const url = new URL(request.url);

    // Try to get the asset
    const asset = await env.ASSETS.fetch(request);

    // If asset exists, return it
    if (asset.status !== 404) {
      return asset;
    }

    // For SPA routing, return index.html for non-asset requests
    if (!url.pathname.includes('.')) {
      return env.ASSETS.fetch(new URL('/index.html', request.url));
    }

    return asset;
  },
};
