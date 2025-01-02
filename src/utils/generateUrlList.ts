import { createSlug } from './slug';
import type { Event } from '../types/types';
import type { D1Database } from '@cloudflare/workers-types';

export async function generateUrlList(dbInstance: D1Database): Promise<string> {
    try {
        // Get all events
        const { results } = await dbInstance
            .prepare('SELECT event_id, subject, venue FROM events')
            .all();

        // Generate URLs
        const urls = results.map(event => ({
            URL: `${createSlug(
                event.subject as string || undefined,
                event.location as string || undefined,
                event.event_id as number
            )}`
        }));

        // Convert to JSON string with pretty formatting
        return JSON.stringify(urls, null, 2);
    } catch (error) {
        console.error('Failed to generate URL list:', error);
        return '[]';
    }
} 