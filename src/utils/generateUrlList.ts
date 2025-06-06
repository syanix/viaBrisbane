import { createSlug, createParkingMeterSlug, createTruckSlug } from './slug';
import type { Event, ParkingMeter, FoodTruck } from '../types/types';
import type { D1Database } from '@cloudflare/workers-types';

export async function generateUrlList(dbInstance: D1Database, type: string | undefined = 'events'): Promise<string> {
    try {
        let query: string;

        // Define the SQL query based on the type.
        switch (type) {
            case 'parking-meters':
                query = 'SELECT METER_NO, STREET, SUBURB FROM parking_meters';
                break;
            case 'food-trucks':
                query = 'SELECT truck_id, name FROM food_trucks';
                break;
            case 'events':
            default:
                query = 'SELECT event_id, subject, location, slug FROM events';
                break;
        }

        // Specify the expected results type explicitly.
        const { results }: { results: unknown[] } = await dbInstance.prepare(query).all();

        // Use type guards to ensure proper type narrowing.
        let urls = results.map((item) => {
            let slug: string;

            if (type === 'parking-meters' && isParkingMeter(item)) {
                slug = createParkingMeterSlug({ 
                    METER_NO: item.METER_NO, 
                    STREET: item.STREET, 
                    SUBURB: item.SUBURB 
                });
                return {
                    URL: `/${type}/${slug}`
                };
            } else if (type === 'food-trucks' && isFoodTruck(item)) {
                slug = createTruckSlug(item.truck_id, item.name);
                // Ensure the slug doesn't start with a slash
                if (slug.startsWith('/')) {
                    slug = slug.substring(1);
                }
                return {
                    URL: `/${type}/${slug}`
                };
            } else if (type === 'events' && isEvent(item)) {
                // Use the slug field if available, otherwise generate it
                slug = item.slug || createSlug(item.subject, item.location);
                // Ensure the slug doesn't start with a slash
                if (slug.startsWith('/')) {
                    slug = slug.substring(1);
                }
                return {
                    URL: `/${type}/${slug}`
                };
            } else {
                throw new Error('Unexpected item structure');
            }
        });

        // For events, remove duplicate URLs to ensure each URL appears only once
        if (type === 'events') {
            const uniqueUrls = new Map();
            urls.forEach(item => {
                uniqueUrls.set(item.URL, item);
            });
            urls = Array.from(uniqueUrls.values());
        }

        return JSON.stringify(urls, null, 2);
    } catch (error) {
        console.error('Failed to generate URL list:', error);
        return '[]';
    }
}

// Type guard for ParkingMeter
function isParkingMeter(item: unknown): item is ParkingMeter {
    return (
        typeof item === 'object' &&
        item !== null &&
        'METER_NO' in item &&
        'STREET' in item &&
        'SUBURB' in item
    );
}

// Type guard for FoodTruck
function isFoodTruck(item: unknown): item is FoodTruck {
    return (
        typeof item === 'object' &&
        item !== null &&
        'truck_id' in item &&
        'name' in item
    );
}

// Type guard for Event
function isEvent(item: unknown): item is Event {
    return (
        typeof item === 'object' &&
        item !== null &&
        'event_id' in item &&
        'subject' in item &&
        'location' in item &&
        // slug might be null for some events
        ('slug' in item || true)
    );
}