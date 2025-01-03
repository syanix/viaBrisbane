import { createSlug } from './slug';
import type { D1Database } from '@cloudflare/workers-types';

export async function generateFoodTruckUrlList(dbInstance: D1Database): Promise<string> {
    try {
        // Get all food trucks
        const { results } = await dbInstance
            .prepare('SELECT truck_id, name FROM food_trucks')
            .all();

        // Generate URLs
        const urls = results.map(truck => ({
            URL: `food-trucks/${createSlug(
                truck.name as string,
                undefined,
                truck.truck_id as number
            )}`
        }));

        // Convert to JSON string with pretty formatting
        return JSON.stringify(urls, null, 2);
    } catch (error) {
        console.error('Failed to generate food truck URL list:', error);
        return '[]';
    }
} 