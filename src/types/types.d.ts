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

export enum HotelCategory {
  luxury = "Luxury",
  "mid-range" = "Mid-Range",
  boutique = "Boutique",
  budget = "Budget-Friendly",
  "budget-friendly" = "Budget-Friendly",
  other = "Other"
}

export enum HotelArea {
  cbd = "Brisbane CBD",
  southbank = "South Bank",
  "fortitude-valley" = "Fortitude Valley",
  "south-inner-suburbs" = "South/Inner Suburbs",
  "north-inner-suburbs" = "North/Inner Suburbs",
  "airport-surrounds" = "Airport & Surrounds"
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  category?: string;
  area: string;
  location?: string;
  price: string;
  image: string;
  images?: {
    url: string;
    caption?: string;
    category?: string;
  }[];
  dealBadge?: string;
  affiliateLink?: string;
  featured?: boolean;
  starRating: number;
  guestRating: {
    value: number;
    count: number;
  };
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

export interface Event {
  event_id: number;
  subject: string;
  web_link: string;
  location: string;
  start_datetime: string;
  end_datetime: string;
  formatteddatetime: string;
  description: string;
  event_template: string | null;
  event_type: string | null;
  venue: string | null;
  venueaddress: string | null;
  venuetype: string | null;
  parentevent: string | null;
  primaryeventtype: string | null;
  cost: string | null;
  eventimage: string | null;
  age: string | null;
  bookings: string | null;
  bookingsrequired: boolean;
  agerange: string | null;
  libraryeventtypes: string | null;
  eventtype: string | null;
  status: string | null;
  maximumparticipantcapacity: string | null;
  activitytype: string | null;
  requirements: string | null;
  meetingpoint: string | null;
  waterwayaccessfacilities: string | null;
  waterwayaccessinformation: string | null;
  communityhall: string | null;
  image: string | null;
  suburb: string | null;
  ward: string | null;
  locationifvenueunavailable: string | null;
  externaleventid: string | null;
  slug: string | null;
} 

export interface FoodTruck {
  truck_id: number;
  name: string;
  category: string;
  bio: string;
  avatar: string;
  cover_photo: string;
  website: string;
  facebook_url: string;
  instagram_handle: string;
  twitter_handle: string;
}

export interface LocationTips {
  highlights: string;
  transportation: string;
  bestFor: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  description: string;
  tips: LocationTips;
  categories: {
    id: string;
    name: string;
    hotels: Hotel[];
  }[];
}

export {};