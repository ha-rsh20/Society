const fs = require("fs");
const path = require("path");

const runId = new Date().toISOString().replace(/[:.]/g, "-");
const fileName = `activity-${runId}.log`;
const filePath = path.join(__dirname, fileName);

function ensureLogFile() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "", "utf8");
  }
}

function logActivity(activityInfo) {
  ensureLogFile();

  const now = new Date();
  const message =
    typeof activityInfo === "string"
      ? activityInfo
      : JSON.stringify(activityInfo);
  const logEntry = `${now.toISOString()} | ${message}\n`;

  fs.appendFileSync(filePath, logEntry, "utf8");
}

ensureLogFile();

module.exports = logActivity;
