import fetch from "node-fetch";

// URL do seu Worker
const WORKER_URL = "https://linktree-214.pages.dev/sanity-webhook/";

// Payload de teste
const payload = {
  _id: "teste12313123",
  title: "Link de Teste123123",
  url: "https://example4241242.com",
  order: 1,
  highlight: true
};

async function testWebhook() {
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Resposta:", text);
  } catch (err) {
    console.error("Erro ao chamar webhook:", err);
  }
}

testWebhook();