import type { Event } from '../types/types';
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
