import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'https://www.viabrisbane.com';
  
  // Redirect to the sitemap index
  return new Response('', {
    status: 301,
    headers: {
      'Location': `${baseUrl}/sitemap-index.xml`
    }
  });
};
