import { oauthHandler } from 'decap-cms-oauth-provider-node';

export default function handler(req, res) {
  return oauthHandler(req, res, {
    // ID e segredo do GitHub
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    // URL de callback (a mesma cadastrada no GitHub)
    redirect_uri: `${process.env.OAUTH_REDIRECT_URL}`,
    // Domínios permitidos a acessar o CMS
    allowedOrigins: ['https://linktree-214.pages.dev'],
  });
}
