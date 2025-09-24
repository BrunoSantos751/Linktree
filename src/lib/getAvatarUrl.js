import imageUrlBuilder from '@sanity/image-url';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'et01yfkf',  
  dataset: 'production',
  apiVersion: '2025-09-24',    
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function getAvatarUrl(source) {
  if (!source) return null;
  return builder.image(source).width(150).height(150).url();
}

export { client };
