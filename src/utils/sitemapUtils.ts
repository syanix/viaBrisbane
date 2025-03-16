import type { D1Database } from '@cloudflare/workers-types';
import { generateUrlList } from './generateUrlList';

// Maximum URLs per sitemap file
export const MAX_URLS_PER_SITEMAP = 10000;

// Cache duration in seconds (24 hours)
export const CACHE_DURATION = 86400;

// In-memory cache for sitemaps
const sitemapCache = new Map<string, { content: string, timestamp: number }>();

/**
 * Generate a sitemap for a specific content type
 */
export async function generateSitemap(
  request: Request,
  dbInstance: D1Database,
  type: string,
  priority: string = '0.7',
  changefreq: string = 'weekly'
): Promise<Response> {
  const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'https://www.viabrisbane.com';
  
  // Get page number from URL
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  
  // Check for cached response
  const cacheKey = `sitemap-${type}-${page}-${url.pathname}`;
  const now = Date.now();
  const cachedItem = sitemapCache.get(cacheKey);
  
  // Return cached response if it's still valid
  if (cachedItem && (now - cachedItem.timestamp) < CACHE_DURATION * 1000) {
    return new Response(cachedItem.content, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `public, max-age=${CACHE_DURATION}`
      }
    });
  }
  
  // Get URLs for this type
  const urlsJson = await generateUrlList(dbInstance, type);
  const allUrls = JSON.parse(urlsJson);
  
  // Calculate total pages
  const totalPages = Math.ceil(allUrls.length / MAX_URLS_PER_SITEMAP);
  
  // If there are multiple pages and this is the main sitemap file (no page parameter),
  // generate a sitemap index instead
  if (totalPages > 1 && !url.searchParams.has('page')) {
    return generateSitemapIndex(request, type, totalPages);
  }
  
  // Get the URLs for this page
  const startIndex = (page - 1) * MAX_URLS_PER_SITEMAP;
  const endIndex = Math.min(startIndex + MAX_URLS_PER_SITEMAP, allUrls.length);
  const urls = allUrls.slice(startIndex, endIndex);
  
  // Build sitemap XML
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add URLs
  urls.forEach((item: { URL: string }) => {
    sitemap += `
      <url>
        <loc>${baseUrl}${item.URL}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>
    `;
  });
  
  sitemap += '</urlset>';
  
  // Store in cache
  sitemapCache.set(cacheKey, {
    content: sitemap,
    timestamp: now
  });
  
  // Create the response
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `public, max-age=${CACHE_DURATION}`
    }
  });
}

/**
 * Generate a sitemap index for a content type with multiple pages
 */
export async function generateSitemapIndex(
  request: Request,
  type: string,
  totalPages: number
): Promise<Response> {
  const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'https://www.viabrisbane.com';
  const url = new URL(request.url);
  
  // Check for cached response
  const cacheKey = `sitemap-index-${type}-${url.pathname}`;
  const now = Date.now();
  const cachedItem = sitemapCache.get(cacheKey);
  
  // Return cached response if it's still valid
  if (cachedItem && (now - cachedItem.timestamp) < CACHE_DURATION * 1000) {
    return new Response(cachedItem.content, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `public, max-age=${CACHE_DURATION}`
      }
    });
  }
  
  // Build sitemap index XML
  let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add each page
  for (let i = 1; i <= totalPages; i++) {
    sitemapIndex += `
      <sitemap>
        <loc>${baseUrl}/sitemap-${type}.xml?page=${i}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    `;
  }
  
  sitemapIndex += '</sitemapindex>';
  
  // Store in cache
  sitemapCache.set(cacheKey, {
    content: sitemapIndex,
    timestamp: now
  });
  
  // Create the response
  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `public, max-age=${CACHE_DURATION}`
    }
  });
} 