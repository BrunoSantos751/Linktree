import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'et01yfkf',  
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: true,
});

export function getSanityImageUrl(assetRef) {
  if (!assetRef) return null;

  const [_, id, dimension] = assetRef.match(/image-([a-f0-9]+)-(\w+)/) || [];
  if (!id) return null;


  return `https://cdn.sanity.io/images/et01yfkf/production/${id}-${dimension}.jpg`;
}
