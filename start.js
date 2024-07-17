import { spawn } from "child_process";

function runCommand(command, args = []) {
  const process = spawn(command, args, { stdio: "inherit" });

  process.on("error", (err) => {
    console.error(`Failed to start ${command}:`, err);
  });

  return process;
}

async function startApp() {
  try {
    console.log("Setting up database...");
    await new Promise((resolve, reject) => {
      const setup = runCommand("node", ["setup_db.js"]);
      setup.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Database setup exited with code ${code}`));
        } else {
          resolve();
        }
      });
    });

    console.log("Starting application...");
    runCommand("node", ["app.js"]);

    console.log("Starting worker...");
    runCommand("node", ["update_stargazers.js"]);
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startApp();
