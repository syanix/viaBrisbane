import type { Location } from '../types/types.d';

/**
 * Generates metadata for a hotel location page
 */
export function generateHotelLocationMetadata(location: Location) {
  return {
    title: `${location.name} Hotels | Best Places to Stay in ${location.name}`,
    description: `Discover the best hotels in ${location.name}. From luxury stays to mid-range and budget-friendly accommodations in this popular Brisbane area.`,
    keywords: `${location.name} hotels, Brisbane accommodation, where to stay in ${location.name}, hotels in ${location.name}, Brisbane`
  };
} 