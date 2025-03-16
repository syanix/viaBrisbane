import type { Event } from '../types/types';
import type { D1Database } from "@cloudflare/workers-types";

const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface EventsCache {
    [key: string]: {
        data: { events: Partial<Event>[]; totalPages: number };
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
        formatteddatetime,
        location,
        description,
        end_datetime
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
    const events = results.map(result => ({
        event_id: result.event_id as number,
        subject: result.subject as string,
        eventimage: result.eventimage as string,
        formatteddatetime: result.formatteddatetime as string,
        location: result.location as string,
        description: result.description as string
    })) as Partial<Event>[];
    
    // Cache the results
    globalThis._eventsCache[cacheKey] = {
        data: { events, totalPages },
        expiry: now + CACHE_EXPIRY_MS
    };
    
    return { events, totalPages };
}

export async function getEventBySlug(dbInstance: D1Database, eventId: string):Promise<{ 
event: Event | null; 
dates: { event_id: number; formatteddatetime: string }[] 
}> {
    try {
        // Get the event by ID without any date filtering
        const { results: eventResults } = await dbInstance
            .prepare('SELECT * FROM events WHERE event_id = ?')
            .bind(Number(eventId))
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
        const event = {
            event_id: mainEvent.event_id as number,
            subject: mainEvent.subject as string,
            web_link: mainEvent.web_link as string,
            location: mainEvent.location as string,
            start_datetime: mainEvent.start_datetime as string,
            end_datetime: mainEvent.end_datetime as string,
            formatteddatetime: mainEvent.formatteddatetime as string,
            description: mainEvent.description as string,
            event_template: mainEvent.event_template as string,
            event_type: mainEvent.event_type as string,
            venue: mainEvent.venue as string,
            venueaddress: mainEvent.venueaddress as string,
            venuetype: mainEvent.venuetype as string,
            parentevent: mainEvent.parentevent as string,
            primaryeventtype: mainEvent.primaryeventtype as string,
            cost: mainEvent.cost as string,
            eventimage: mainEvent.eventimage as string,
            age: mainEvent.age as string,
            bookings: mainEvent.bookings as string,
            bookingsrequired: Boolean(mainEvent.bookingsrequired),
            agerange: mainEvent.agerange as string,
            libraryeventtypes: mainEvent.libraryeventtypes as string,
            eventtype: mainEvent.eventtype as string,
            status: mainEvent.status as string,
            maximumparticipantcapacity: mainEvent.maximumparticipantcapacity as string,
            activitytype: mainEvent.activitytype as string,
            requirements: mainEvent.requirements as string,
            meetingpoint: mainEvent.meetingpoint as string,
            waterwayaccessfacilities: mainEvent.waterwayaccessfacilities as string,
            waterwayaccessinformation: mainEvent.waterwayaccessinformation as string,
            communityhall: mainEvent.communityhall as string,
            image: mainEvent.image as string
        } as Event;

        return { 
            event,
            dates: dates.length > 0 ? dates : [{
                event_id: event.event_id,
                formatteddatetime: event.formatteddatetime
            }]
        };
    } catch (error) {
        console.error('Failed to fetch event:', error);
        return { event: null, dates: [] };
    }
}