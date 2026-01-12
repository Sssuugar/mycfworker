export default {
  async fetch(request, env, ctx) {
    return new Response('Hello Cloudflare! This is a simple Worker.', {
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
      },
    });
  },
};
