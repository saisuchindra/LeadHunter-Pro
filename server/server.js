const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./src/config/env');
const errorHandler = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimit');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const leadsRoutes = require('./src/routes/leads.routes');
const searchRoutes = require('./src/routes/search.routes');
const outreachRoutes = require('./src/routes/outreach.routes');
const campaignsRoutes = require('./src/routes/campaigns.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');
const aiRoutes = require('./src/routes/ai.routes');

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({
  origin: env.nodeEnv === 'production' ? process.env.FRONTEND_URL : '*',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
if (env.nodeEnv === 'production') {
  app.use(apiLimiter);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/outreach', outreachRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`LeadHunter Pro API running on port ${env.port}`);
});

module.exports = app;
