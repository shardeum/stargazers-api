import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function setupDatabase() {
  const db = await open({
    filename: "./stargazers.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS existing_stargazers_table (
      username TEXT PRIMARY KEY
    );
    
    CREATE TABLE IF NOT EXISTS incoming_data_table (
      username TEXT PRIMARY KEY
    );
  `);

  await db.close();

  console.log("Database setup complete");
}

setupDatabase().catch(console.error);
