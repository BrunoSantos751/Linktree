export default {
  name: 'link',
  title: 'Links',
  type: 'document',
  fields: [
    { name: 'order', title: 'Ordem', type: 'number' },
    { name: 'title', title: 'Título do Botão', type: 'string' },
    { name: 'url', title: 'URL do Link', type: 'url' },
    { name: 'highlight', title: 'Link em Destaque?', type: 'boolean' }
  ],
  orderings: [
    {
      title: 'Ordem crescente',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]0000
}
