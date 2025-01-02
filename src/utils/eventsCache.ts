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

export async function getEventBySlug(dbInstance: D1Database, eventId: string): Promise<Event | null> {
    try {
        const { results } = await dbInstance
            .prepare('SELECT * FROM events WHERE event_id = ?')
            .bind(Number(eventId))
            .all();
            
        if (!results[0]) return null;
        
        return {
            event_id: results[0].event_id as number,
            subject: results[0].subject as string,
            web_link: results[0].web_link as string,
            location: results[0].location as string,
            start_datetime: results[0].start_datetime as string,
            end_datetime: results[0].end_datetime as string,
            formatteddatetime: results[0].formatteddatetime as string,
            description: results[0].description as string,
            event_template: results[0].event_template as string,
            event_type: results[0].event_type as string,
            venue: results[0].venue as string,
            venueaddress: results[0].venueaddress as string,
            venuetype: results[0].venuetype as string,
            parentevent: results[0].parentevent as string,
            primaryeventtype: results[0].primaryeventtype as string,
            cost: results[0].cost as string,
            eventimage: results[0].eventimage as string,
            age: results[0].age as string,
            bookings: results[0].bookings as string,
            bookingsrequired: Boolean(results[0].bookingsrequired),
            agerange: results[0].agerange as string,
            libraryeventtypes: results[0].libraryeventtypes as string,
            eventtype: results[0].eventtype as string,
            status: results[0].status as string,
            maximumparticipantcapacity: results[0].maximumparticipantcapacity as string,
            activitytype: results[0].activitytype as string,
            requirements: results[0].requirements as string,
            meetingpoint: results[0].meetingpoint as string,
            waterwayaccessfacilities: results[0].waterwayaccessfacilities as string,
            waterwayaccessinformation: results[0].waterwayaccessinformation as string,
            communityhall: results[0].communityhall as string,
            image: results[0].image as string
        } as Event;
    } catch (error) {
        console.error('Failed to fetch event:', error);
        return null;
    }
}