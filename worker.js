const DEFAULT_FALLBACK = 'https://www.google.com/';
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      let path;
      try {
        path = decodeURIComponent(
          url.pathname.replace(/^\/+|\/+$/g, '')
        );
      } catch {
        path = null;
      }
      const fallback =
        typeof env.default === 'string' && env.default.trim()
          ? env.default.trim()
          : DEFAULT_FALLBACK;
      const target = path === ''
        ? env.root
        : path !== null && Object.hasOwn(env, path)
          ? env[path]
          : null;
      const redirectUrl =
        typeof target === 'string' && target.trim()
          ? target.trim()
          : fallback;
      const parsed = new URL(redirectUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('不允许的跳转协议');
      }
      return new Response(null, {
        status: 302,
        headers: {
          'Location': parsed.href,
          'Cache-Control': 'no-store'
        }
      });
    } catch (error) {
      console.error('短链接服务错误:', error.message);
      return new Response('Short link service error', {
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
  }
};
