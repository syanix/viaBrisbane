import type { D1Database } from '@cloudflare/workers-types';

declare var DB: D1Database | undefined; // D1Database available in production (Cloudflare)

// Detect if running on Cloudflare
if (typeof DB !== 'undefined') {
  globalThis._isCloudflare = true;
} else {
  globalThis._isCloudflare = false;
}

// Environment variable for local database path
const LOCAL_DB_PATH = import.meta.env.LOCAL_DB_PATH || './local-database.sqlite';
console.log(`Resolved database path: ${LOCAL_DB_PATH}`);

// Type definition for better-sqlite3 instance
type BetterSqlite3Database = InstanceType<typeof import('better-sqlite3').default>;

let localDb: BetterSqlite3Database | null = null;

// Initialize the local database if not running on Cloudflare
if (!globalThis._isCloudflare && process.env.NODE_ENV === 'development') {
  (async () => {
    try {
      const { default: Database } = await import('better-sqlite3');
      localDb = new Database(LOCAL_DB_PATH, { verbose: console.log });
      console.log('Local SQLite database initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize local SQLite database:', error);
    }
  })();
}

/**
 * Executes a query against the database.
 *
 * @param sql - The SQL query to execute.
 * @param params - Parameters for the SQL query.
 * @returns The results of the query.
 */
export async function queryDatabase<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  if (localDb) {
    try {
      // Execute the query using better-sqlite3 for local development
      const stmt = localDb.prepare(sql);
      return stmt.all(...params);
    } catch (error) {
      console.error('Error executing query in local database:', error);
      throw error;
    }
  } else if (DB) {
    try {
      // Execute the query using Cloudflare D1Database in production
      const result = await DB.prepare(sql).bind(...params).all<T>();
      return result.results || [];
    } catch (error) {
      console.error('Error executing query in Cloudflare D1Database:', error);
      throw error;
    }
  } else {
    throw new Error('No database connection available.');
  }
}

export async function testDatabaseConnection(): Promise<string> {
    try {
      const testResult = await queryDatabase('SELECT 1 AS result');
      return `Database connection successful: ${JSON.stringify(testResult)}`;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return `Database connection failed: ${error instanceof Error ? error.message : String(error)}`;
    }
  }