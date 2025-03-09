// common/logger
import dotenv from 'dotenv';
dotenv.config();

import pino from "pino";

const l = pino({
  name: process.env.APP_ID || 'Startersoft-node-api',  // Ensure APP_ID has a fallback
  level: process.env.LOG_LEVEL || 'debug',     // Ensure LOG_LEVEL is set
});

export default l;