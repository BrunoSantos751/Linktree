export async function onRequest(context) {
  const { request } = context;
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const data = await request.json();
    console.log("Payload recebido:", data);
    return new Response("✅ Payload recebido com sucesso!");
  } catch (err) {
    console.error(err);
    return new Response("Erro interno", { status: 500 });
  }
}
