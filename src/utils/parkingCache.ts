import type { ParkingMeter } from '../types/types';
import { queryDatabase } from './database';

const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function getParkingMetersWithCache(): Promise<ParkingMeter[]> {
    const now = Date.now();
    const cache = globalThis._parkingCache;

    if (cache && now < cache.expiry) {
        console.log("Serving parking data from cache");
        return cache.data;
    }

    console.log('Fetching fresh parking data');
    try {
        const data = await queryDatabase<ParkingMeter>(
            'SELECT * FROM parking_meters ORDER BY METER_NO'
        );

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