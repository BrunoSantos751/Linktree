// /functions/sanity-webhook.js
export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload;
  try {
    payload = await request.json();
    console.log("Payload recebido:", payload);
  } catch (err) {
    console.error("Erro ao ler JSON:", err);
    return new Response("Invalid JSON", { status: 400 });
  }

  const requiredFields = ["_id", "title", "url", "order", "highlight"];
  for (const field of requiredFields) {
    if (!(field in payload)) {
      return new Response(`Campo faltando: ${field}`, { status: 400 });
    }
  }

  const fileName = `${payload._id}.json`;
  const fileContent = JSON.stringify(payload, null, 2);

  const githubOwner = env.GITHUB_OWNER;
  const githubRepo = env.GITHUB_REPO;
  const githubBranch = env.GITHUB_BRANCH || "main";
  const githubToken = env.GITHUB_TOKEN;
  console.log("GITHUB_OWNER:", githubOwner);
  console.log("GITHUB_REPO:", githubRepo);
  console.log("GITHUB_BRANCH:", githubBranch);
  console.log("GITHUB_TOKEN presente?", !!githubToken);

  if (!githubOwner || !githubRepo || !githubToken) {
    return new Response("Secrets GitHub não configurados", { status: 500 });
  }

  const apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/src/content/links/${fileName}`;

  try {
    // Verifica se o arquivo já existe para pegar o SHA
    const getRes = await fetch(apiUrl + `?ref=${githubBranch}`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let sha;
    if (getRes.status === 200) {
      const data = await getRes.json();
      sha = data.sha;
      console.log("Arquivo existente, SHA:", sha);
    } else {
      console.log("Arquivo não existe, será criado.");
    }

    const commitMessage = sha
      ? `Atualizando link: ${payload.title}`
      : `Adicionando link: ${payload.title}`;

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: btoa(fileContent),
        branch: githubBranch,
        sha,
      }),
    });

    const putData = await putRes.json();
    if (!putRes.ok) {
      console.error("Erro ao criar/atualizar arquivo no GitHub:", putData);
      return new Response("Erro GitHub: " + JSON.stringify(putData), { status: 500 });
    }

    console.log("✅ Commit enviado com sucesso!", putData.content.path);
    return new Response("✅ Commit enviado com sucesso!", { status: 200 });
  } catch (err) {
    console.error("Erro ao comunicar com GitHub:", err);
    
    return new Response("Erro interno", { status: 500 });
  }
}
