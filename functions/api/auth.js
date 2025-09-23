export async function onRequest(context) {
  const { env, request } = context;

  // URL de callback
  const redirectUri = `${new URL(request.url).origin}/api/auth/callback`;

  // Construir URL de login do GitHub
  const githubLoginUrl = new URL("https://github.com/login/oauth/authorize");
  githubLoginUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  githubLoginUrl.searchParams.set("redirect_uri", redirectUri);
  githubLoginUrl.searchParams.set("scope", "repo,user:email");

  return Response.redirect(githubLoginUrl.toString(), 302);
}
