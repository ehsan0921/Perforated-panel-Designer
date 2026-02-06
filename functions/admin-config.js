// Cloudflare Pages Function to inject SUPERADMIN_EMAIL
// This runs server-side and injects the env var into the HTML

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // Only handle admin-config.js requests
    if (url.pathname === '/admin-config.js') {
        const superadminEmail = env.SUPERADMIN_EMAIL || 'Ehsan0921@gmail.com';
        
        const configScript = `// Admin Configuration (injected by Cloudflare Pages Function)
window.ADMIN_CONFIG = {
    SUPERADMIN_EMAIL: '${superadminEmail}'
};`;
        
        return new Response(configScript, {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache'
            }
        });
    }
    
    return context.next();
}
