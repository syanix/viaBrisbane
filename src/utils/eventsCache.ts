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

export async function getEventsByPage(dbInstance: D1Database, page: number = 1, searchQuery: string = ''): Promise<{ events: Partial<Event>[]; totalPages: number; }> {
    const cacheKey = `events_${page}_${searchQuery}`;
    const now = Date.now();
    
    // Check cache
    if (globalThis._eventsCache[cacheKey] && globalThis._eventsCache[cacheKey].expiry > now) {
        return globalThis._eventsCache[cacheKey].data;
    }

    const ITEMS_PER_PAGE = 30;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const params: any[] = [];
    
    // Select only needed fields and filter by end date
    let query = `SELECT 
        event_id,
        subject,
        eventimage,
        formatteddatetime,
        location,
        description
    FROM events
    WHERE end_datetime > datetime('now')`;
    
    let countQuery = "SELECT COUNT(*) as count FROM events WHERE end_datetime > datetime('now')";
    
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
        const { results: mainresults } = await dbInstance
            .prepare('SELECT * FROM events WHERE event_id = ?')
            .bind(Number(eventId))
            .all();
            
        if (!mainresults[0]) return { event: null, dates: [] };

        const mainEvent = mainresults[0];

        const { results: relatedResults } = await dbInstance
            .prepare(`
                SELECT * FROM events 
                WHERE LOWER(subject) = LOWER(?)
                AND LOWER(location) = LOWER(?)
                AND end_datetime > datetime('now')
                ORDER BY start_datetime ASC
            `)
            .bind(
                mainEvent.subject,
                mainEvent.location
            )
            .all();

            const dates = relatedResults.map((result: Record<string, unknown>) => ({
                event_id: result.event_id as number,
                formatteddatetime: result.formatteddatetime as string
            }));

        if (relatedResults.length == 0) return { event: null, dates: [] };
        
        const relatedEvent = {
            event_id: relatedResults[0].event_id as number,
            subject: relatedResults[0].subject as string,
            web_link: relatedResults[0].web_link as string,
            location: relatedResults[0].location as string,
            start_datetime: relatedResults[0].start_datetime as string,
            end_datetime: relatedResults[0].end_datetime as string,
            formatteddatetime: relatedResults[0].formatteddatetime as string,
            description: relatedResults[0].description as string,
            event_template: relatedResults[0].event_template as string,
            event_type: relatedResults[0].event_type as string,
            venue: relatedResults[0].venue as string,
            venueaddress: relatedResults[0].venueaddress as string,
            venuetype: relatedResults[0].venuetype as string,
            parentevent: relatedResults[0].parentevent as string,
            primaryeventtype: relatedResults[0].primaryeventtype as string,
            cost: relatedResults[0].cost as string,
            eventimage: relatedResults[0].eventimage as string,
            age: relatedResults[0].age as string,
            bookings: relatedResults[0].bookings as string,
            bookingsrequired: Boolean(relatedResults[0].bookingsrequired),
            agerange: relatedResults[0].agerange as string,
            libraryeventtypes: relatedResults[0].libraryeventtypes as string,
            eventtype: relatedResults[0].eventtype as string,
            status: relatedResults[0].status as string,
            maximumparticipantcapacity: relatedResults[0].maximumparticipantcapacity as string,
            activitytype: relatedResults[0].activitytype as string,
            requirements: relatedResults[0].requirements as string,
            meetingpoint: relatedResults[0].meetingpoint as string,
            waterwayaccessfacilities: relatedResults[0].waterwayaccessfacilities as string,
            waterwayaccessinformation: relatedResults[0].waterwayaccessinformation as string,
            communityhall: relatedResults[0].communityhall as string,
            image: relatedResults[0].image as string
        } as Event;

        return { 
            event: relatedEvent,
            dates 
        };
    } catch (error) {
        console.error('Failed to fetch event:', error);
        return { event: null, dates: [] };
    }
}