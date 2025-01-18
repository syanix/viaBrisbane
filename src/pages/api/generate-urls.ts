import type { APIRoute } from 'astro';
import { generateUrlList } from '../../utils/generateUrlList';

export const GET: APIRoute = async ({ locals, url }) => {
    try {
        const tableType = url.searchParams.get('type') || 'events'; // default to events if no type specified
        const urls = await generateUrlList(locals.runtime.env.DB, tableType);
        
        return new Response(urls, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        const type = url.searchParams.get('type') || 'events';
        console.error(`Error generating URLs for ${type}:`, error);
        return new Response('Error generating URLs', { status: 500 });
    }
}; 