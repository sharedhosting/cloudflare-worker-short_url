export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path;
    try {
      path = decodeURIComponent(
        url.pathname.replace(/^\/+|\/+$/g, '')
      );
    } catch {
      path = null;
    }
    const target = path === ''
      ? env.root
      : path !== null ? env[path] : null;
    const redirectUrl =
      typeof target === 'string' && target.trim()
        ? target.trim()
        : env.default;
    try {
      const parsed = new URL(redirectUrl);

      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error();
      }
    } catch {
      return new Response('Redirect URL invalid', {
        status: 500,
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'Cache-Control': 'no-store'
      }
    });
  }
};
