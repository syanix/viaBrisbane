import type { APIRoute } from 'astro';
import { CACHE_DURATION } from '../utils/sitemapUtils';

// In-memory cache for the sitemap index
interface CacheItem {
  content: string;
  timestamp: number;
}

let indexCache: CacheItem | null = null;

export const GET: APIRoute = async ({ request }) => {
  const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'https://www.viabrisbane.com';
  
  // Check for cached response
  const now = Date.now();
  
  // Return cached response if it's still valid
  if (indexCache && (now - indexCache.timestamp) < CACHE_DURATION * 1000) {
    return new Response(indexCache.content, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `public, max-age=${CACHE_DURATION}`
      }
    });
  }
  
  // Define the sitemap types
  const sitemapTypes = [
    { name: 'static', priority: '1.0' },
    { name: 'events', priority: '0.8' },
    { name: 'parking-meters', priority: '0.7' },
    { name: 'food-trucks', priority: '0.7' }
  ];
  
  // Build sitemap index XML
  let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add each sitemap type
  sitemapTypes.forEach(type => {
    sitemapIndex += `
      <sitemap>
        <loc>${baseUrl}/sitemap-${type.name}.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    `;
  });
  
  sitemapIndex += '</sitemapindex>';
  
  // Update the cache
  indexCache = {
    content: sitemapIndex,
    timestamp: now
  };
  
  // Create the response
  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `public, max-age=${CACHE_DURATION}`
    }
  });
}; 