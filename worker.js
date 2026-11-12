export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 获取路径，去除前后斜杠
    let path;

    try {
      path = decodeURIComponent(
        url.pathname.replace(/^\/+|\/+$/g, '')
      );
    } catch {
      path = null;
    }

    // 根路径使用 root，其余路径直接匹配变量名称
    const target = path === ''
      ? env.root
      : path !== null ? env[path] : null;

    // 未设置或为空时使用默认地址
    const redirectUrl =
      typeof target === 'string' && target.trim()
        ? target.trim()
        : env.default;

    // 检查跳转地址
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

    // 302 跳转，禁止缓存
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'Cache-Control': 'no-store'
      }
    });
  }
};
