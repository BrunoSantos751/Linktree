export async function onRequest(context) {
  return new Response("Hello from Cloudflare Function!", {
    headers: { "content-type": "text/plain" },
  });
}
