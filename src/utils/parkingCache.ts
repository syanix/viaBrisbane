import type { ParkingMeter } from '../types/types';
import { fetchParkingMeters } from './database'; // Import the encapsulated function
import type { D1Database } from "@cloudflare/workers-types";

const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

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