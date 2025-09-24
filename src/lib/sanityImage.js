// src/lib/sanityImage.js
import imageUrlBuilder from '@sanity/image-url';
import client from './sanity';

const builder = imageUrlBuilder(client);

export function sanityImage(source) {
  if (!source) return null;
  return builder.image(source).width(150).height(150).url();
}
