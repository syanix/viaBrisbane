/// <reference types="astro/client" />

declare global {
  interface Window {
    adsbygoogle?: Array<{ google_ad_client: string; enable_page_level_ads: boolean }>;
    google?: typeof import('@googlemaps/google-maps-services-js').google;
    initMap: () => void;
  }

  interface EventCacheData {
    results: Event[];
  }

  interface NewsCacheData {
    items: NewsItem[];
  }

  interface GlobalCache {
    _eventsCache?: Record<string, { data: EventCacheData; expiry: number }>;
    _newsCache?: Record<string, { data: NewsCacheData; expiry: number }>;
  }

  interface Global {
    _isCloudflare?: boolean;
}

  var _isCloudflare: boolean | undefined; 

  var _parkingCache: {
    data: ParkingMeter[];
    expiry: number;
  } | undefined;

  var globalThis: GlobalCache;
}

export interface Event {
  eventimage?: string;
  subject?: string;
  web_link?: string;
  formatteddatetime?: string;
  location?: string;
  cost?: string;
  bookings?: string;
  description?: string;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  enclosure?: { link: string };
}

export type FetchWithCache<T> = (url: string) => Promise<T>;

export interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
}

export interface ParkingMeter {
  ObjectId: number;
  METER_NO: number;
  CATEGORY: string;
  STREET: string;
  SUBURB: string;
  MAX_STAY_HRS: string;
  RESTRICTIONS?: string; // Optional instead of `| null`
  OPERATIONAL_DAY: string;
  OPERATIONAL_TIME: string;
  TAR_ZONE: string;
  TAR_RATE_WEEKDAY?: number; // Optional instead of `| null`
  TAR_RATE_AH_WE?: number; // Optional instead of `| null`
  LOC_DESC: string;
  VEH_BAYS: number;
  MC_BAYS: number;
  MC_RATE?: number; // Optional instead of `| null`
  LONGITUDE: number;
  LATITUDE: number;
  MOBILE_ZONE: number;
  MAX_CAP_CHG?: string; // Optional instead of `| null`
}

export {};