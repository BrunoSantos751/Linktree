export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    console.log("Payload recebido:", payload);

    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const GITHUB_OWNER = env.GITHUB_OWNER;
    const GITHUB_REPO = env.GITHUB_REPO;
    const GITHUB_BRANCH = env.GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return new Response("Variáveis do GitHub não configuradas", { status: 500 });
    }

    const filename = `src/content/links/${payload.title}.json`;
    const fileContent = JSON.stringify({
      title: payload.title,
      url: payload.url,
      order: payload.order,
      highlight: payload.highlight
    }, null, 2);

    function base64Encode(str) {
      return btoa(unescape(encodeURIComponent(str)));
    }

    // Primeiro, verifica se o arquivo existe
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

    // Se o payload indicar deleção
    if (payload.toDelete) {
      if (!sha) {
        console.log("Arquivo já não existe, nada a deletar.");
        return new Response("✅ Arquivo já não existe", { status: 200 });
      }

      const deleteResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "User-Agent": "sanity-webhook",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `Deleta link ${payload.title}`,
            branch: GITHUB_BRANCH,
            sha
          })
        }
      );

      const deleteData = await deleteResponse.json();
      if (!deleteResponse.ok) {
        console.error("Erro ao deletar no GitHub:", deleteData);
        return new Response(JSON.stringify(deleteData), { status: 500 });
      }

      console.log("Arquivo deletado com sucesso:", deleteData.commit?.sha);
      return new Response("✅ Arquivo deletado", { status: 200 });
    }

    // Se não for deleção → criar ou atualizar
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
