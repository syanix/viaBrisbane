import type { APIRoute } from 'astro';
import { CACHE_DURATION } from '../utils/sitemapUtils';

// In-memory cache for the static sitemap
interface CacheItem {
  content: string;
  timestamp: number;
}

let staticCache: CacheItem | null = null;

export const GET: APIRoute = async ({ request }) => {
  const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'https://www.viabrisbane.com';
  
  // Check for cached response
  const now = Date.now();
  
  // Return cached response if it's still valid
  if (staticCache && (now - staticCache.timestamp) < CACHE_DURATION * 1000) {
    return new Response(staticCache.content, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `public, max-age=${CACHE_DURATION}`
      }
    });
  }
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0' },
    { url: '/about-us', priority: '0.8' },
    { url: '/contact-us', priority: '0.8' },
    { url: '/resources', priority: '0.8' },
    { url: '/events', priority: '0.8' },
    { url: '/parking-meters', priority: '0.8' },
    { url: '/food-trucks', priority: '0.8' }
  ];
  
  // Build sitemap XML
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
      <url>
        <loc>${baseUrl}${page.url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page.priority}</priority>
      </url>
    `;
  });
  
  sitemap += '</urlset>';
  
  // Update the cache
  staticCache = {
    content: sitemap,
    timestamp: now
  };
  
  // Create the response
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `public, max-age=${CACHE_DURATION}`
    }
  });
}; 