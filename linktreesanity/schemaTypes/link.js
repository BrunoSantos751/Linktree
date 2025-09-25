export default {
  name: 'link',
  title: 'Links',
  type: 'document',
  fields: [
    { name: 'order', title: 'Ordem', type: 'number' },
    { name: 'title', title: 'Título do Botão', type: 'string' },
    { name: 'url', title: 'URL do Link', type: 'string' },
    { name: 'highlight', title: 'Link em Destaque?', type: 'boolean' },
    { name: 'icon', title: 'Icone', type: 'image' },
  ],
  orderings: [
    {
      title: 'Ordem crescente',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}
