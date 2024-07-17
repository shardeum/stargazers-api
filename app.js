import express from "express";
import helmet from "helmet";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Set trust proxy
app.set("trust proxy", 1);

// Check if user has starred
async function hasUserStarred(username) {
  const db = await open({
    filename: "./stargazers.db",
    driver: sqlite3.Database,
  });

  try {
    const result = await db.get(
      "SELECT * FROM existing_stargazers_table WHERE username = ?",
      username.toLowerCase()
    );
    return result !== undefined;
  } finally {
    await db.close();
  }
}

// Routes
app.get("/check-star/:username", async (req, res) => {
  try {
    console.log(`Received request for username: ${req.params.username}`);
    const username = req.params.username;
    const hasStarred = await hasUserStarred(username);
    res.json({ hasStarred });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/check-star", async (req, res) => {
  try {
    const username = req.query.username;
    console.log(`Received request for username: ${username}`);
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const hasStarred = await hasUserStarred(username);
    res.json({ hasStarred });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
