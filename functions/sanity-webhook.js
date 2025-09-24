export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    console.log("Payload recebido:", payload);

    const token = env.GITHUB_TOKEN;
    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const branch = env.GITHUB_BRANCH;

    if (!token || !owner || !repo || !branch) {
      return new Response("Missing GitHub secrets", { status: 500 });
    }

    const filePath = `src/content/links/${payload._id}.json`;

    const fileContent = {
      title: payload.title,
      url: payload.url,
      order: payload.order,
      highlight: payload.highlight || false,
    };

    // 1️⃣ Tenta obter SHA se o arquivo já existe
    const getFileResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "SanityWebhook",
          Accept: "application/vnd.github+json",
        },
      }
    );

    let sha = null;
    if (getFileResp.status === 200) {
      const fileData = await getFileResp.json();
      sha = fileData.sha;
    }

    // 2️⃣ Cria ou atualiza arquivo
    const commitResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "SanityWebhook",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: `Atualizando link ${payload.title}`,
          content: Buffer.from(JSON.stringify(fileContent, null, 2)).toString("base64"),
          branch,
          sha,
        }),
      }
    );

    const commitResult = await commitResp.json();
    console.log("Resultado do commit:", commitResult);

    if (!commitResp.ok) {
      console.error("Erro ao comunicar com GitHub:", commitResult);
      return new Response("Erro ao salvar no GitHub", { status: 500 });
    }

    return new Response("✅ Link salvo no GitHub e pronto para deploy!", { status: 200 });
  } catch (err) {
    console.error("Erro interno:", err);
    return new Response("Erro interno", { status: 500 });
  }
}
