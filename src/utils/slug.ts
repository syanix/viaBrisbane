import type { ParkingMeter, FoodTruck } from '../types/types';
export function createSlug(subject?: string, venue?: string, eventId?: number): string {
    if (!subject || !eventId) return `${eventId || 'event'}`;
    
    // Get first part of venue before comma if it exists
    const cleanVenue = venue?.split(',')[0].trim();
    
    // Create the slug with new structure
    const titleSlug = (cleanVenue ? `${subject}-${cleanVenue}` : subject)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['()&+]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    return `${eventId}/${titleSlug}`;
}

export function createParkingMeterSlugByMeter(meter: ParkingMeter): string {
    return createParkingMeterSlug(meter.METER_NO, meter.STREET, meter.SUBURB);
}

export function createParkingMeterSlug(meter_no?: number, street?: string, suburb?: string): string {
    if (!street || !suburb || !meter_no) return `${meter_no || 'parking-meter'}`;
    return `${meter_no}-${street.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${suburb.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export function createTruckSlugByTruck(truck: FoodTruck) {
    return createTruckSlug(truck.truck_id, truck.name);
}

export function createTruckSlug(truckId?: number, truckName?: string) {
    if (!truckName || !truckId) return `${truckId || 'food-truck'}`;
    return `${truckId}/${truckName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}
