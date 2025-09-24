export async function onRequestPost({ request }) {
  try {
    const payload = await request.json();
    console.log("Payload recebido:", payload);

    const GITHUB_TOKEN = GITHUB_TOKEN; // definir como Secret no Cloudflare
    const GITHUB_OWNER = GITHUB_OWNER;
    const GITHUB_REPO = GITHUB_REPO;
    const GITHUB_BRANCH = GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return new Response("Variáveis do GitHub não configuradas", { status: 500 });
    }

    const filename = `links/${payload._id}.json`;
    const fileContent = JSON.stringify({
      title: payload.title,
      url: payload.url,
      order: payload.order,
      highlight: payload.highlight
    }, null, 2);

    // função para converter string em Base64 compatível com Cloudflare
    function base64Encode(str) {
      return btoa(unescape(encodeURIComponent(str)));
    }

    // Verifica se o arquivo existe
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "sanity-webhook"
        }
      }
    );

    let sha;
    if (getResponse.status === 200) {
      const data = await getResponse.json();
      sha = data.sha;
      console.log("Arquivo existe, SHA:", sha);
    }

    const commitResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "sanity-webhook",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: sha ? `Atualiza link ${payload.title}` : `Adiciona link ${payload.title}`,
          content: base64Encode(fileContent),
          branch: GITHUB_BRANCH,
          sha
        })
      }
    );

    const commitData = await commitResponse.json();
    if (!commitResponse.ok) {
      console.error("Erro ao comunicar com GitHub:", commitData);
      return new Response(JSON.stringify(commitData), { status: 500 });
    }

    console.log("Commit realizado com sucesso:", commitData.commit?.sha);

    return new Response("✅ Payload recebido e commit concluído!", { status: 200 });
  } catch (err) {
    console.error("Erro interno:", err);
    return new Response(`Erro interno: ${err.message}`, { status: 500 });
  }
}
