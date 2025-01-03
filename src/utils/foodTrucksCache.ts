import type { D1Database } from "@cloudflare/workers-types";

interface FoodTruck {
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

const CACHE_EXPIRY_MS = 60 * 60 * 1000 * 24; // 1 day

export async function getFoodTrucksByPage(
    dbInstance: D1Database,
    page: number = 1,
    searchQuery: string = ''
): Promise<{ trucks: FoodTruck[]; totalPages: number; }> {
    const ITEMS_PER_PAGE = 30;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const params: any[] = [];
    
    let query = `SELECT * FROM food_trucks WHERE 1=1`;
    let countQuery = "SELECT COUNT(*) as count FROM food_trucks WHERE 1=1";
    
    if (searchQuery) {
        query += " AND (name LIKE ? OR category LIKE ?)";
        countQuery += " AND (name LIKE ? OR category LIKE ?)";
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }
    
    const countResult = await dbInstance.prepare(countQuery).bind(...params).all();
    const totalCount = countResult.results[0].count as number;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
    query += ` ORDER BY name ASC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    
    const { results } = await dbInstance.prepare(query).bind(...params).all();
    
    return { 
        trucks: results as unknown as FoodTruck[], 
        totalPages 
    };
}

export async function getFoodTruckById(
    dbInstance: D1Database, 
    truckId: number
): Promise<FoodTruck | null> {
    try {
        const { results } = await dbInstance
            .prepare('SELECT * FROM food_trucks WHERE truck_id = ?')
            .bind(truckId)
            .all();
            
        return results[0] as unknown as FoodTruck || null;
    } catch (error) {
        console.error('Failed to fetch food truck:', error);
        return null;
    }
} 