import type { APIRoute } from 'astro';
import { generateFoodTruckUrlList } from '../../utils/generateFoodTruckUrlList';

export const GET: APIRoute = async ({ locals }) => {
    try {
        const urls = await generateFoodTruckUrlList(locals.runtime.env.DB);
        
        return new Response(urls, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error generating URLs:', error);
        return new Response('Error generating URLs', { status: 500 });
    }
}; 