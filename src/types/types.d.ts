/// <reference types="astro/client" />
declare var adsbygoogle: Array<Record<string, unknown>>;
declare global {
  interface Window {
      adsbygoogle?: Array<{ google_ad_client: string; enable_page_level_ads: boolean }>;
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

export {};