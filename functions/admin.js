export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    try {
      const body = await request.json();
      const { _id, title, url, order, highlight } = body;

      if (!_id || !title || !url) return new Response("Invalid payload", { status: 400 });

      const filename = `src/content/links/${_id}.json`;
      const content = JSON.stringify({ title, url, order: order ?? 0, highlight: highlight ?? false }, null, 2);

      // Checa se o arquivo já existe
      const getFile = await fetch(
        `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${filename}?ref=${env.GITHUB_BRANCH}`,
        { headers: { Authorization: `token ${env.GITHUB_TOKEN}`, "User-Agent": "cloudflare-worker" } }
      );

      let sha = null;
      if (getFile.ok) {
        const fileData = await getFile.json();
        sha = fileData.sha;
      }

      // Cria/atualiza arquivo no GitHub
      const commit = await fetch(
        `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${filename}`,
        {
          method: "PUT",
          headers: { Authorization: `token ${env.GITHUB_TOKEN}`, "User-Agent": "cloudflare-worker" },
          body: JSON.stringify({
            message: `Update link ${title}`,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: env.GITHUB_BRANCH,
            sha: sha || undefined
          }),
        }
      );

      if (!commit.ok) {
        const errorText = await commit.text();
        return new Response("GitHub commit failed: " + errorText, { status: 500 });
      }

      return new Response("✅ Commit enviado com sucesso!");
    } catch (err) {
      return new Response("Erro: " + err.message, { status: 500 });
    }
  },
};
