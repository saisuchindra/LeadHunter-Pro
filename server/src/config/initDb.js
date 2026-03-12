const db = require('./db');

const schema = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),

  has_website BOOLEAN DEFAULT FALSE,
  website_url VARCHAR(500),
  website_speed_score INT,

  has_gmb BOOLEAN DEFAULT FALSE,
  gmb_url VARCHAR(500),
  google_rating DECIMAL(2,1),
  review_count INT DEFAULT 0,
  last_gmb_update DATE,

  instagram_url VARCHAR(500),
  facebook_url VARCHAR(500),
  has_social BOOLEAN DEFAULT FALSE,

  opportunity_score INT,
  score_reasons JSONB,

  status VARCHAR(50) DEFAULT 'new',
  assigned_to UUID REFERENCES users(id),
  tags TEXT[],
  notes TEXT,

  source VARCHAR(100) DEFAULT 'google_places',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outreach_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  direction VARCHAR(20) DEFAULT 'outbound',
  subject VARCHAR(500),
  body TEXT,
  status VARCHAR(50) DEFAULT 'sent',
  opened_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  call_duration INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(100),
  variables TEXT[],
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'email',
  status VARCHAR(50) DEFAULT 'draft',
  lead_filter JSONB,
  sequence JSONB,
  stats JSONB DEFAULT '{"sent":0,"opened":0,"replied":0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_city_idx ON leads(city);
CREATE INDEX IF NOT EXISTS leads_category_idx ON leads(category);
CREATE INDEX IF NOT EXISTS leads_score_idx ON leads(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_user_idx ON leads(user_id);
`;

async function init() {
  try {
    await db.query(schema);
    console.log('Database schema initialized successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database schema:', err);
    process.exit(1);
  }
}

init();
