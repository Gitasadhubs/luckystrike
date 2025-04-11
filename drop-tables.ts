import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// Database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function dropTables() {
  try {
    console.log('Dropping all tables...');
    
    // Disable foreign key checks to avoid constraint issues
    await pool.query('DO $$BEGIN EXECUTE \'SET CONSTRAINTS ALL DEFERRED\'; END$$;');
    
    // Drop tables in reverse order of dependencies
    await pool.query('DROP TABLE IF EXISTS "game_activities" CASCADE;');
    await pool.query('DROP TABLE IF EXISTS "games" CASCADE;');
    await pool.query('DROP TABLE IF EXISTS "users" CASCADE;');
    await pool.query('DROP TABLE IF EXISTS "session" CASCADE;');
    
    console.log('All tables dropped successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping tables:', error);
    process.exit(1);
  }
}

dropTables();