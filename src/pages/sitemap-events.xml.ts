import type { APIRoute } from 'astro';
import { generateSitemap } from '../utils/sitemapUtils';

export const GET: APIRoute = async ({ request, locals }) => {
  return generateSitemap(request, locals.runtime.env.DB, 'events', '0.8');
}; 