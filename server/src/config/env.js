const dotenv = require('dotenv');
dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL,
  google: {
    placesApiKey: process.env.GOOGLE_PLACES_API_KEY,
    pageSpeedApiKey: process.env.GOOGLE_PAGESPEED_API_KEY,
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  rateLimits: {
    searchPerDay: parseInt(process.env.SEARCH_RATE_LIMIT, 10) || 10,
    emailPerHour: parseInt(process.env.EMAIL_RATE_LIMIT_HOURLY, 10) || 50,
  },
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
  },
};
