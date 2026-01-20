# 🌐 Linktree

Um clone personalizado do **Linktree** feito com **Astro**, consumindo dados do **Sanity CMS**. Permite criar botões com links, ícones, destaque e avatar de perfil, totalmente configurável via CMS.

---

## 📝 Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| Avatar | Exibe avatar do usuário carregado do Sanity |
| Botões | Nome centralizado, ícone opcional à esquerda, destaque visual |
| Personalização | Configuração de título, descrição, cores de fundo e destaque via CMS |
| Links múltiplos | Suporte a vários links organizados por ordem |
| Deploy | Deploy simplificado em Vercel ou outro host estático |

---

## ⚙️ Tecnologias

- [Astro](https://astro.build/)
- [Sanity CMS](https://www.sanity.io/)
- JavaScript/TypeScript
- CSS para estilização responsiva
- Deploy contínuo via **Vercel**

---
### Webhook:

- Cria/atualiza `.json` de cada link em `src/content/links/`.
- Permite deletar links quando removidos no Sanity.
- Atualiza os settings (título, descrição, cores, avatar).

## 🚀 Rodando Localmente

1. Instale dependências:

npm install

  Crie arquivo .env com variáveis do Sanity e GitHub:

SANITY_PROJECT_ID=seu_project_id
SANITY_DATASET=production
GITHUB_TOKEN=seu_token
GITHUB_OWNER=usuario
GITHUB_REPO=repo
GITHUB_BRANCH=main

  Rodar o app em dev:

npm run dev

  Build para produção:

npm run build
