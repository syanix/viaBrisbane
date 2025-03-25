import type { APIRoute } from 'astro';

interface SitemapItem {
  url: string;
  lastmod: Date;
  changefreq?: string;
  priority?: string;
}

/**
 * Generates a sitemap XML from an array of page data
 */
export function generateSitemapFromArray(pages: SitemapItem[]): Response {
  const baseUrl = 'https://www.viabrisbane.com';
  
  // Build sitemap XML
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add URLs
  pages.forEach(page => {
    sitemap += `
      <url>
        <loc>${baseUrl}${page.url}</loc>
        <lastmod>${page.lastmod.toISOString()}</lastmod>
        <changefreq>${page.changefreq || 'weekly'}</changefreq>
        <priority>${page.priority || '0.7'}</priority>
      </url>
    `;
  });
  
  sitemap += '</urlset>';
  
  // Create the response
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400' // 24 hours
    }
  });
} 