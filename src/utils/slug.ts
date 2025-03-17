import type { ParkingMeter, FoodTruck } from '../types/types';

/**
 * Creates a URL-friendly slug from a subject and location
 */
export function createSlug(subject: string, location: string): string {
    // Normalize inputs
    const normalizedSubject = (subject || '').trim().toLowerCase();
    const normalizedLocation = (location || '').trim().toLowerCase();
    
    // Create slug components
    const subjectSlug = normalizeForUrl(normalizedSubject);
    const locationSlug = normalizeForUrl(normalizedLocation);
    
    // Combine components
    return `${subjectSlug}-${locationSlug}`;
}

/**
 * Creates a URL-friendly slug with ID (for backward compatibility)
 */
export function createSlugWithId(subject: string, location: string, id: number): string {
    // Normalize inputs
    const normalizedSubject = (subject || '').trim().toLowerCase();
    const normalizedLocation = (location || '').trim().toLowerCase();
    
    // Create slug components
    const subjectSlug = normalizeForUrl(normalizedSubject);
    const locationSlug = normalizeForUrl(normalizedLocation);
    
    // Combine components with ID
    return `${id}/${subjectSlug}-${locationSlug}`;
}

/**
 * Creates a URL-friendly slug for a parking meter
 */
export function createParkingMeterSlug(meter: { METER_NO: number; STREET: string; SUBURB: string }): string {
    const street = normalizeForUrl(meter.STREET.toLowerCase());
    const suburb = normalizeForUrl(meter.SUBURB.toLowerCase());
    return `${meter.METER_NO}-${street}-${suburb}`;
}

/**
 * Creates a URL-friendly slug for a parking meter using the meter object
 */
export function createParkingMeterSlugByMeter(meter: { METER_NO: number; STREET: string; SUBURB: string }): string {
    return createParkingMeterSlug(meter);
}

/**
 * Creates a URL-friendly slug for a food truck
 */
export function createTruckSlug(truckId: number, name: string): string {
    const normalizedName = normalizeForUrl(name.toLowerCase());
    return `${truckId}/${normalizedName}`;
}

/**
 * Creates a URL-friendly slug for a food truck using the truck object
 */
export function createTruckSlugByTruck(truck: { truck_id: number; name: string }): string {
    return createTruckSlug(truck.truck_id, truck.name);
}

/**
 * Normalizes a string for use in a URL
 * Replaces spaces with hyphens, removes special characters
 */
function normalizeForUrl(str: string): string {
    return str
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, '')  // Remove leading/trailing hyphens
        || 'unknown';             // Default value if empty
}
