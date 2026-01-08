const rateLimit = require('express-rate-limit');

// Default global rate limiter - conservative limits for public API
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // limit each IP to 120 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Tighter limiter for auth/payment endpoints
const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalLimiter, strictLimiter };
