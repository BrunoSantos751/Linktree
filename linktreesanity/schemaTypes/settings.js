export default {
  name: 'settings',
  title: 'Configurações Gerais',
  type: 'document',
  fields: [
    { name: 'avatar', title: 'Avatar', type: 'image' },
    { name: 'title', title: 'Título do Site', type: 'string' },
    { name: 'description', title: 'Descrição (SEO)', type: 'text' },
    { name: 'backgroundColor', title: 'Cor de Fundo', type: 'string' },
    { name: 'highlightColor', title: 'Cor do Botão em Destaque', type: 'string' }
  ],
}
