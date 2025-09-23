import { oauthCallback } from "decap-cms-oauth-provider-node";

export async function onRequest(context) {
  return oauthCallback(context.request, {
    client_id: context.env.GITHUB_CLIENT_ID,
    client_secret: context.env.GITHUB_CLIENT_SECRET,
    redirect_uri: "https://linktree-214.pages.dev/api/auth/callback",
  });
}
