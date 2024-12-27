import { drizzle } from "drizzle-orm/d1";
import { parkingMeters } from "../schema"; // Ensure schema.ts defines the parkingMeters table
import type { D1Database } from "@cloudflare/workers-types";

/**
 * Initialize the Drizzle ORM instance using the provided D1Database.
 *
 * @param dbInstance - The D1Database instance to use.
 * @returns A promise that resolves with the data from the parking_meters table.
 */
export async function fetchParkingMeters(dbInstance: D1Database): Promise<any[]> {
  try {
    const db = drizzle(dbInstance); // Initialize drizzle with the D1Database instance

    // Fetch data from the parkingMeters table
    const results = await db
      .select()
      .from(parkingMeters)
      .orderBy(parkingMeters.METER_NO) // Assuming METER_NO is part of the schema and can be ordered
      .all();

    return results;
  } catch (error) {
    console.error("Failed to fetch parking meters:", error);
    throw new Error(`Error fetching parking meters: ${error instanceof Error ? error.message : String(error)}`);
  }
}