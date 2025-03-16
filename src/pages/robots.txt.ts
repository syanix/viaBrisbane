import type { APIRoute } from 'astro';
import { CACHE_DURATION } from '../utils/sitemapUtils';

// In-memory cache for robots.txt
interface CacheItem {
  content: string;
  timestamp: number;
}

let robotsCache: CacheItem | null = null;

export const GET: APIRoute = async ({ request }) => {
  const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'https://www.viabrisbane.com';
  
  // Check for cached response
  const now = Date.now();
  
  // Return cached response if it's still valid
  if (robotsCache && (now - robotsCache.timestamp) < CACHE_DURATION * 1000) {
    return new Response(robotsCache.content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': `public, max-age=${CACHE_DURATION}`
      }
    });
  }
  
  const robotsTxt = `
User-agent: *
Allow: /

# Disallow admin or private areas if needed
# Disallow: /admin/

# Sitemap location
Sitemap: ${baseUrl}/sitemap-index.xml
`;

  // Update the cache
  robotsCache = {
    content: robotsTxt,
    timestamp: now
  };

  // Create the response
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': `public, max-age=${CACHE_DURATION}`
    }
  });
};
