// Root entrypoint for deployment environments that require an "index.js" file.
// This script simply launches the backend server using the backend package scripts.

const { spawn } = require("child_process");

const child = spawn("npm", ["run", "start", "--prefix", "Backend"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code);
});
