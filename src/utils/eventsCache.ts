import type { Event } from '../types/types';
import type { D1Database } from "@cloudflare/workers-types";
import { createSlug } from './slug';

const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface EventsCache {
    [key: string]: {
        data: { 
            events: Partial<Event>[]; 
            totalPages: number;
            totalCount?: number; 
        };
        expiry: number;
    };
}

declare global {
    var _eventsCache: EventsCache;
}

if (!globalThis._eventsCache) {
    globalThis._eventsCache = {};
}

export async function getEventsByPage(
    dbInstance: D1Database, 
    page: number = 1, 
    searchQuery: string = '', 
    includeExpired: boolean = false
): Promise<{ events: Partial<Event>[]; totalPages: number; }> {
    const cacheKey = `events_${page}_${searchQuery}_${includeExpired}`;
    const now = Date.now();
    
    // Check cache
    if (globalThis._eventsCache[cacheKey] && globalThis._eventsCache[cacheKey].expiry > now) {
        return globalThis._eventsCache[cacheKey].data;
    }

    const ITEMS_PER_PAGE = 30;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const params: any[] = [];
    
    // Select only needed fields and filter by end date if not including expired events
    let query = `SELECT 
        event_id,
        subject,
        eventimage,
        venue,
        venueaddress,
        event_type,
        primaryeventtype,
        formatteddatetime,
        location,
        description,
        end_datetime,
        slug
    FROM events`;
    
    let countQuery = "SELECT COUNT(*) as count FROM events";
    
    // Only filter by end date if we're not including expired events
    if (!includeExpired) {
        query += " WHERE end_datetime > datetime('now')";
        countQuery += " WHERE end_datetime > datetime('now')";
    } else {
        query += " WHERE 1=1"; // Always true condition to simplify adding more conditions
        countQuery += " WHERE 1=1";
    }
    
    if (searchQuery) {
        query += " AND subject LIKE ?";
        countQuery += " AND subject LIKE ?";
        params.push(`%${searchQuery}%`);
    }
    
    const countResult = await dbInstance.prepare(countQuery).bind(...params).all();
    const totalCount = countResult.results[0].count as number;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
    query += ` ORDER BY 
        CASE 
            WHEN formatteddatetime LIKE '%ongoing%' THEN 1 
            ELSE 0 
        END,
        start_datetime ASC 
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    
    const { results } = await dbInstance.prepare(query).bind(...params).all();
    const events = results.map(result => {
        // If slug is missing, generate it from subject and location
        const slug = result.slug || createSlug(result.subject as string, result.location as string);
        
        return {
            event_id: result.event_id as number,
            subject: result.subject as string,
            eventimage: result.eventimage as string,
            venue: result.venue as string,
            venueaddress: result.venueaddress as string,
            event_type: result.event_type as string,
            primaryeventtype: result.primaryeventtype as string,
            formatteddatetime: result.formatteddatetime as string,
            location: result.location as string,
            description: result.description as string,
            slug: slug
        };
    }) as Partial<Event>[];
    
    // Cache the results
    globalThis._eventsCache[cacheKey] = {
        data: { events, totalPages },
        expiry: now + CACHE_EXPIRY_MS
    };
    
    return { events, totalPages };
}

export async function getEventBySlug(dbInstance: D1Database, slug: string):Promise<{ 
event: Event | null; 
dates: { event_id: number; formatteddatetime: string }[] 
}> {
    try {
        // Check if the slug is a numeric ID (old format)
        const isNumeric = /^\d+$/.test(slug.split('/')[0]);
        
        if (isNumeric) {
            // Old format: Extract the event ID from the slug
            const eventId = slug.split('/')[0];
            return await getEventById(dbInstance, Number(eventId));
        } else {
            // New format: Use the slug field directly - just get events with this exact slug
            const { results: eventResults } = await dbInstance
                .prepare('SELECT * FROM events WHERE slug = ? ORDER BY start_datetime ASC')
                .bind(slug)
                .all();
                
            if (!eventResults.length) {
                console.log('No event found with slug:', slug);
                return { event: null, dates: [] };
            }

            console.log(`Found ${eventResults.length} events with slug: ${slug}`);

            // Use the first (latest) event as the main event
            const mainEvent = eventResults[0];
            
            // Extract dates from all matching events
            const dates = eventResults.map((result: Record<string, unknown>) => ({
                event_id: result.event_id as number,
                formatteddatetime: result.formatteddatetime as string
            }));
            
            // Convert the main event to the expected type
            const event = convertToEvent(mainEvent);

            return { event, dates };
        }
    } catch (error) {
        console.error('Failed to fetch event:', error);
        return { event: null, dates: [] };
    }
}

// Keep getEventById for backward compatibility with old URLs
export async function getEventById(dbInstance: D1Database, eventId: number):Promise<{ 
event: Event | null; 
dates: { event_id: number; formatteddatetime: string }[] 
}> {
    try {
        // Get the event by ID without any date filtering
        const { results: eventResults } = await dbInstance
            .prepare('SELECT * FROM events WHERE event_id = ?')
            .bind(eventId)
            .all();
            
        if (!eventResults[0]) return { event: null, dates: [] };

        const mainEvent = eventResults[0];

        // For related events (same subject and location), get all instances
        const { results: relatedResults } = await dbInstance
            .prepare(`
                SELECT * FROM events 
                WHERE LOWER(subject) = LOWER(?)
                AND LOWER(location) = LOWER(?)
                ORDER BY start_datetime ASC
            `)
            .bind(
                mainEvent.subject,
                mainEvent.location
            )
            .all();

        // Extract dates from related events
        const dates = relatedResults.map((result: Record<string, unknown>) => ({
            event_id: result.event_id as number,
            formatteddatetime: result.formatteddatetime as string
        }));
        
        // Convert the main event to the expected type
        const event = convertToEvent(mainEvent);

        return { event, dates };
    } catch (error) {
        console.error('Failed to fetch event by ID:', error);
        return { event: null, dates: [] };
    }
}

// Helper function to convert a database result to an Event object
function convertToEvent(result: Record<string, unknown>): Event {
    return {
        event_id: result.event_id as number,
        subject: result.subject as string,
        web_link: result.web_link as string,
        location: result.location as string,
        start_datetime: result.start_datetime as string,
        end_datetime: result.end_datetime as string,
        formatteddatetime: result.formatteddatetime as string,
        description: result.description as string,
        event_template: result.event_template as string,
        event_type: result.event_type as string,
        venue: result.venue as string,
        venueaddress: result.venueaddress as string,
        venuetype: result.venuetype as string,
        parentevent: result.parentevent as string,
        primaryeventtype: result.primaryeventtype as string,
        cost: result.cost as string,
        eventimage: result.eventimage as string,
        age: result.age as string,
        bookings: result.bookings as string,
        bookingsrequired: Boolean(result.bookingsrequired),
        agerange: result.agerange as string,
        libraryeventtypes: result.libraryeventtypes as string,
        eventtype: result.eventtype as string,
        status: result.status as string,
        maximumparticipantcapacity: result.maximumparticipantcapacity as string,
        activitytype: result.activitytype as string,
        requirements: result.requirements as string,
        meetingpoint: result.meetingpoint as string,
        waterwayaccessfacilities: result.waterwayaccessfacilities as string,
        waterwayaccessinformation: result.waterwayaccessinformation as string,
        communityhall: result.communityhall as string,
        image: result.image as string,
        slug: result.slug as string || ''
    } as Event;
}

/**
 * Get events filtered by venue name
 */
export async function getEventsByVenue(
    dbInstance: D1Database,
    venue: string,
    page: number = 1
): Promise<{ events: Partial<Event>[]; totalCount: number; totalPages: number }> {
    const ITEMS_PER_PAGE = 30;
    const cacheKey = `events_venue_${venue}_${page}`;
    const now = Date.now();
    
    // Check cache
    if (globalThis._eventsCache[cacheKey] && globalThis._eventsCache[cacheKey].expiry > now) {
        return globalThis._eventsCache[cacheKey].data as { events: Partial<Event>[]; totalCount: number; totalPages: number };
    }
    
    // Decode the venue name from the URL format
    const decodedVenue = decodeURIComponent(venue).replace(/-/g, ' ');
    
    // Calculate offset for pagination
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const params: any[] = [decodedVenue + '%']; // Use wildcard to match venue names starting with the search term

    // Query to get events filtered by venue
    let query = `
        SELECT 
            event_id,
            subject,
            eventimage,
            venue,
            venueaddress,
            event_type,
            primaryeventtype,
            formatteddatetime,
            location,
            description,
            end_datetime,
            slug
        FROM events
        WHERE venue LIKE ? 
        AND end_datetime > datetime('now')
    `;

    // Count query for pagination
    let countQuery = `
        SELECT COUNT(*) as count 
        FROM events 
        WHERE venue LIKE ? 
        AND end_datetime > datetime('now')
    `;

    // Get total count for pagination
    const countResult = await dbInstance.prepare(countQuery).bind(...params).all();
    const totalCount = countResult.results[0].count as number;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Get events for the current page with order
    query += `
        ORDER BY 
        CASE 
            WHEN formatteddatetime LIKE '%ongoing%' THEN 1 
            ELSE 0 
        END,
        start_datetime ASC 
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const { results } = await dbInstance.prepare(query).bind(...params).all();

    // Process the events
    const events = results.map(result => {
        // Generate slug if missing
        const slug = result.slug || createSlug(result.subject as string, result.location as string);
        
        return {
            event_id: result.event_id as number,
            subject: result.subject as string,
            eventimage: result.eventimage as string,
            venue: result.venue as string,
            venueaddress: result.venueaddress as string,
            event_type: result.event_type as string,
            primaryeventtype: result.primaryeventtype as string,
            formatteddatetime: result.formatteddatetime as string,
            location: result.location as string,
            description: result.description as string,
            slug: slug
        };
    }) as Partial<Event>[];
    
    // Cache the results
    const result = { events, totalCount, totalPages };
    globalThis._eventsCache[cacheKey] = {
        data: result,
        expiry: now + CACHE_EXPIRY_MS
    };
    
    return result;
}

/**
 * Get events filtered by category/event type
 */
export async function getEventsByCategory(
    dbInstance: D1Database,
    category: string,
    page: number = 1
): Promise<{ events: Partial<Event>[]; totalCount: number; totalPages: number }> {
    const ITEMS_PER_PAGE = 30;
    const cacheKey = `events_category_${category}_${page}`;
    const now = Date.now();
    
    // Check cache
    if (globalThis._eventsCache[cacheKey] && globalThis._eventsCache[cacheKey].expiry > now) {
        return globalThis._eventsCache[cacheKey].data as { events: Partial<Event>[]; totalCount: number; totalPages: number };
    }
    
    // Decode the category name from the URL format
    const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');
    
    // Calculate offset for pagination
    const offset = (page - 1) * ITEMS_PER_PAGE;

    // Query to get events filtered by category
    // Note: event_type is a comma-separated list, so we use LIKE to find partial matches
    let query = `
        SELECT 
            event_id,
            subject,
            eventimage,
            venue,
            venueaddress,
            event_type,
            primaryeventtype,
            formatteddatetime,
            location,
            description,
            end_datetime,
            slug
        FROM events
        WHERE (event_type LIKE ? OR primaryeventtype LIKE ?)
        AND end_datetime > datetime('now')
    `;

    // Count query for pagination
    let countQuery = `
        SELECT COUNT(*) as count 
        FROM events 
        WHERE (event_type LIKE ? OR primaryeventtype LIKE ?)
        AND end_datetime > datetime('now')
    `;

    // Parameters for the query (search for category in both event_type and primaryeventtype)
    const queryParams = [`%${decodedCategory}%`, `%${decodedCategory}%`];

    // Get total count for pagination
    const countResult = await dbInstance.prepare(countQuery).bind(...queryParams).all();
    const totalCount = countResult.results[0].count as number;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Get events for the current page with order
    query += `
        ORDER BY 
        CASE 
            WHEN formatteddatetime LIKE '%ongoing%' THEN 1 
            ELSE 0 
        END,
        start_datetime ASC 
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const { results } = await dbInstance.prepare(query).bind(...queryParams).all();

    // Process the events
    const events = results.map(result => {
        // Generate slug if missing
        const slug = result.slug || createSlug(result.subject as string, result.location as string);
        
        return {
            event_id: result.event_id as number,
            subject: result.subject as string,
            eventimage: result.eventimage as string,
            venue: result.venue as string,
            venueaddress: result.venueaddress as string,
            event_type: result.event_type as string,
            primaryeventtype: result.primaryeventtype as string,
            formatteddatetime: result.formatteddatetime as string,
            location: result.location as string,
            description: result.description as string,
            slug: slug
        };
    }) as Partial<Event>[];
    
    // Cache the results
    const result = { events, totalCount, totalPages };
    globalThis._eventsCache[cacheKey] = {
        data: result,
        expiry: now + CACHE_EXPIRY_MS
    };
    
    return result;
}