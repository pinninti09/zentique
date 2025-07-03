import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon with better error handling
neonConfig.webSocketConstructor = ws;

// Add retry configuration 
neonConfig.fetchConnectionCache = true;
neonConfig.pipelineConnect = false;
neonConfig.poolQueryViaFetch = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Initialize pool with better configuration
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, // Reduced from 20
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Increased timeout
  maxUses: Infinity,
  allowExitOnIdle: false,
});

// Add comprehensive error handling for pool
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // Don't crash the app, just log the error
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

export const db = drizzle({ client: pool, schema });

// Test database connection on startup
export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
