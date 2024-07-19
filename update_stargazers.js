import { Octokit } from "@octokit/rest";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

dotenv.config();

// Array of access tokens
const accessTokens = [
  process.env.GITHUB_ACCESS_TOKEN_1,
  process.env.GITHUB_ACCESS_TOKEN_2,
  process.env.GITHUB_ACCESS_TOKEN_3,
  process.env.GITHUB_ACCESS_TOKEN_4,
];

let currentTokenIndex = 0;

function getNextToken() {
  currentTokenIndex = (currentTokenIndex + 1) % accessTokens.length;
  return accessTokens[currentTokenIndex];
}

function createOctokit() {
  return new Octokit({
    auth: accessTokens[currentTokenIndex],
    request: {
      timeout: 60000,
    },
  });
}

let octokit = createOctokit();

// Rotate token every 15 minutes
setInterval(() => {
  getNextToken();
  octokit = createOctokit();
  console.log("Rotated to next GitHub access token");
}, 15 * 60 * 1000);

async function fetchAllStargazers(retries = 3) {
  let page = 1;
  const perPage = 100;
  let allStargazers = [];

  while (true) {
    try {
      console.log(`Fetching page ${page} of stargazers`);
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/stargazers",
        {
          owner: "shardeum",
          repo: "shardeum",
          per_page: perPage,
          page: page,
        }
      );

      if (response.data.length === 0) break;

      allStargazers = allStargazers.concat(
        response.data.map((user) => user.login.toLowerCase())
      );
      page++;
    } catch (error) {
      console.error(`Error fetching stargazers page ${page}:`, error.message);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        return fetchAllStargazers(retries - 1);
      } else {
        console.error("Max retries reached. Returning current data.");
        break;
      }
    }
  }

  return allStargazers;
}

async function updateDatabase() {
  const db = await open({
    filename: "./stargazers.db",
    driver: sqlite3.Database,
  });

  try {
    const stargazers = await fetchAllStargazers();

    await db.run("BEGIN TRANSACTION");

    // Clear the incoming_data_table
    await db.run("DELETE FROM incoming_data_table");

    // Insert new data into incoming_data_table
    const stmt = await db.prepare(
      "INSERT INTO incoming_data_table (username) VALUES (?)"
    );
    for (const username of stargazers) {
      await stmt.run(username);
    }
    await stmt.finalize();

    // Replace existing_stargazers_table with incoming_data_table
    await db.run("DELETE FROM existing_stargazers_table");
    await db.run(
      "INSERT INTO existing_stargazers_table SELECT * FROM incoming_data_table"
    );

    await db.run("COMMIT");

    console.log(`Updated stargazers database with ${stargazers.length} users`);
  } catch (error) {
    await db.run("ROLLBACK");
    console.error("Error updating database:", error);
  } finally {
    await db.close();
  }
}

console.log("Worker is running");
updateDatabase();
setInterval(updateDatabase, 60 * 1000); // Run every minute