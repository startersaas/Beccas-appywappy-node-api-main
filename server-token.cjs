const crypto = require('crypto');

// Generate a 32-byte (256-bit) random secret, and convert it to a hex string
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Output the secret (for testing purposes, you would store this securely)
console.log(`Generated JWT Secret: ${jwtSecret}`);



