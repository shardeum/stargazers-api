import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function viewData() {
  const db = await open({
    filename: "./stargazers.db",
    driver: sqlite3.Database,
  });

  console.log("Existing Stargazers Table:");
  const existingStargazers = await db.all(
    "SELECT * FROM existing_stargazers_table LIMIT 50"
  );
  console.log(existingStargazers);

  console.log("\nIncoming Data Table:");
  const incomingData = await db.all(
    "SELECT * FROM incoming_data_table LIMIT 50"
  );
  console.log(incomingData);

  console.log("\nCounts:");
  const existingCount = await db.get(
    "SELECT COUNT(*) as count FROM existing_stargazers_table"
  );
  const incomingCount = await db.get(
    "SELECT COUNT(*) as count FROM incoming_data_table"
  );
  console.log(`Existing Stargazers: ${existingCount.count}`);
  console.log(`Incoming Data: ${incomingCount.count}`);

  await db.close();
}

viewData().catch(console.error);
