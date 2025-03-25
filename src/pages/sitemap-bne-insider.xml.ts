import { getCollection, type CollectionEntry } from 'astro:content';
import { generateSitemapFromArray } from '../utils/sitemap';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  
  const pages = posts.map((post: CollectionEntry<'blog'>) => ({
    url: `/bne-insider/${post.slug}/`,
    lastmod: post.data.updatedDate || post.data.pubDate
  }));
  
  return generateSitemapFromArray(pages);
} 