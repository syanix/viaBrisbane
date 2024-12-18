import type { Event } from '../types/types';

interface CacheData {
  timestamp: number;
  data: Event[];
}

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes cache

let eventsCache: CacheData | null = null;

interface EventsApiResponse {
  results: Event[];
}

export async function getEventsWithCache(): Promise<Event[]> {
  // Check if cache exists and is still valid
  if (eventsCache && Date.now() - eventsCache.timestamp < CACHE_DURATION) {
    return eventsCache.data;
  }

  try {
    const response = await fetch('https://events.data.viabrisbane.com');
    const data = await response.json();
    const events = (data as EventsApiResponse).results || [];

    // Update cache
    eventsCache = {
      timestamp: Date.now(),
      data: events
    };

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return cached data if available, even if expired
    return eventsCache?.data || [];
  }
}

export function getCachedEvents(): Event[] {
  return eventsCache?.data || [];
} 