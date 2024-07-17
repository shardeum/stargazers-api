# Shardeum Stargazer API

This project provides an API to check if a GitHub user has starred the Shardeum repository. It also includes a worker to periodically update the local database with the latest stargazers.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## Features

- Check if a user has starred the Shardeum repository
- Periodically update the local database with the latest stargazers
- Express.js API with security middleware (Helmet, CORS)
- SQLite database for storing stargazer information

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/shardeum-stargazer-api.git
cd shardeum-stargazer-api
```

2. Install dependencies:

```bash
npm install
```

## Configuration

1. Create a `.env` file in the project root directory.
2. Add the following environment variables:

```bash
PORT=3000
GITHUB_ACCESS_TOKEN=your_github_access_token
```

Replace `your_github_access_token` with a valid GitHub Personal Access Token.

## Usage

To start the application:

```bash
npm start
```

This command will:

1. Set up the SQLite database
2. Start the Express.js API server
3. Start the worker to update stargazers periodically

## API Endpoints

### Check if a user has starred

- **GET** `/check-star/:username`
- **GET** `/check-star?username=:username`

  Parameters:

  - `username`: GitHub username to check

  Response:

  ```json
  {
    "hasStarred": true|false
  }
  ```

### Project Structure

- setup_db.js: Sets up the SQLite database and creates necessary tables
- app.js: Express.js API server
- update_stargazers.js: Worker to fetch and update stargazers in the database
- start.js: Script to start all components of the application
- package.json: Project metadata and dependencies

### License

This project is licensed under the MIT License.
