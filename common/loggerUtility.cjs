// common/loggerUtility.cjs
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'temporary-log.txt'); // Log file location

const logData = (data) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${data}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file', err);
    }
  });
};

// Export logData using `module.exports`
module.exports = { logData };