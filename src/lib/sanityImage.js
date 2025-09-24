import imageUrlBuilder from '@sanity/image-url';
import { createClient } from '@sanity/client';

// --- CONFIGURAÇÃO DO CLIENT ---
const client = createClient({
  projectId: 'et01yfkf', 
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

/**
 * @param {object} source Objeto de imagem do Sanity
 * @returns {object} Builder para manipular largura, altura etc.
 */
export function urlFor(source) {
  return builder.image(source);
}

export { client };
