import { D1Database } from '@cloudflare/workers-types';

declare var DB: D1Database | undefined; // D1Database available in production (Cloudflare)

// Use the environment variable for the database path
const LOCAL_DB_PATH = import.meta.env.LOCAL_DB_PATH || './local-database.sqlite';
console.log(`Resolved database path: ${LOCAL_DB_PATH}`);

type BetterSqlite3Database = InstanceType<typeof import('better-sqlite3').default>;
let localDb: BetterSqlite3Database | null = null;

(async () => {
    // Conditionally import better-sqlite3 for local development
    if (!globalThis._isCloudflare && process.env.NODE_ENV === 'development') {
        const { default: Database } = await import('better-sqlite3');
        localDb = new Database(LOCAL_DB_PATH, { verbose: console.log });
    }
})();

// Unified query function
export async function queryDatabase<T = any>(
    sql: string,
    params: any[] = []
): Promise<T[]> {
    if (localDb) {
        // Use better-sqlite3 for local development
        const stmt = localDb.prepare(sql);
        return stmt.all(...params);
    } else if (DB) {
        // Use Cloudflare D1Database in production
        const result = await DB.prepare(sql).bind(...params).all<T>();
        return result.results || [];
    } else {
        throw new Error('No database connection available.');
    }
}