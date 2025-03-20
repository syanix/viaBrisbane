import type { ParkingMeter } from '../types/types';
import { fetchParkingMeters } from './database'; // Import the encapsulated function
import type { D1Database } from "@cloudflare/workers-types";

const CACHE_EXPIRY_MS = 60 * 60 * 1000 * 24; // 1 day

// Define global cache type
declare global {
    var _parkingCache: {
        data: ParkingMeter[];
        expiry: number;
    } | undefined;
    var _parkingSuburbCache: {
        [key: string]: {
            data: {
                meters: ParkingMeter[];
                totalCount: number;
                totalPages: number;
            };
            expiry: number;
        };
    } | undefined;
}

// Initialize global cache if it doesn't exist
if (!globalThis._parkingSuburbCache) {
    globalThis._parkingSuburbCache = {};
}

export async function getParkingMetersWithCache(dbInstance: D1Database): Promise<ParkingMeter[]> {
    const now = Date.now();
    const cache = globalThis._parkingCache;

    if (cache && now < cache.expiry) {
        console.log("Serving parking data from cache");
        return cache.data;
    }

    console.log('Fetching fresh parking data');
    try {
        // Use the encapsulated fetch function from database.ts
        const data = await fetchParkingMeters(dbInstance);

        // Update the cache with fresh data
        globalThis._parkingCache = {
            data,
            expiry: now + CACHE_EXPIRY_MS,
        };

        return data;
    } catch (error) {
        console.error('Failed to fetch parking meters:', error);
        return [];
    }
}

/**
 * Get parking meters filtered by suburb
 */
export async function getParkingMetersBySuburb(
    dbInstance: D1Database,
    suburb: string,
    page: number = 1
): Promise<{ meters: ParkingMeter[]; totalCount: number; totalPages: number }> {
    const ITEMS_PER_PAGE = 30;
    const cacheKey = `meters_suburb_${suburb}_${page}`;
    const now = Date.now();
    
    // Initialize cache if it doesn't exist
    if (!globalThis._parkingSuburbCache) {
        globalThis._parkingSuburbCache = {};
    }
    
    // Check cache
    if (
        globalThis._parkingSuburbCache && 
        globalThis._parkingSuburbCache[cacheKey] && 
        globalThis._parkingSuburbCache[cacheKey].expiry > now
    ) {
        console.log(`Serving suburb ${suburb} data from cache`);
        return globalThis._parkingSuburbCache[cacheKey].data;
    }
    
    // Decode the suburb name from the URL format
    const decodedSuburb = decodeURIComponent(suburb).replace(/-/g, ' ');
    
    // Get all parking meters (which are already cached)
    const allMeters = await getParkingMetersWithCache(dbInstance);
    
    // Filter by suburb (case insensitive)
    const filteredMeters = allMeters.filter(meter => 
        meter.SUBURB.toLowerCase() === decodedSuburb.toLowerCase()
    );
    
    // Calculate pagination
    const totalCount = filteredMeters.length;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
    // Get meters for current page
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const metersForPage = filteredMeters.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    // Cache the results
    const result = { 
        meters: metersForPage, 
        totalCount, 
        totalPages 
    };
    
    // Ensure cache exists
    if (!globalThis._parkingSuburbCache) {
        globalThis._parkingSuburbCache = {};
    }
    
    globalThis._parkingSuburbCache[cacheKey] = {
        data: result,
        expiry: now + CACHE_EXPIRY_MS
    };
    
    return result;
}