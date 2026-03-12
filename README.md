# 🎯 LeadHunter Pro

> **Cold Outreach Intelligence Platform** — Find local businesses with weak online presence, analyze them with AI, and manage outreach campaigns.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🔍 Smart Lead Discovery
- Search local businesses by category and city via **Google Places API**
- Automatically detect businesses with no website, weak SEO, missing social media
- AI-powered search suggestions based on city demographics

### 🤖 AI-Powered Analysis (OpenRouter)
- **Lead Analysis** — Strengths, weaknesses, recommendations, and revenue impact estimates
- **Email Generation** — Personalized cold outreach emails based on lead data
- **Call Scripts** — AI-generated scripts with opening, pain points, value prop, and close
- **Smart Suggestions** — AI recommends best business categories to scan per city

### 📧 Outreach Management
- Email composer with template system and variable replacement
- Call logging and script management
- Multi-step sequence builder for drip campaigns
- Full outreach timeline per lead

### 📊 Analytics Dashboard
- Real-time stats: total leads, contacted, replied, converted
- 14-day lead discovery trend chart
- Category breakdown pie chart
- Pipeline Kanban board (New → Contacted → Replied → Meeting → Client → Lost)
- Activity feed with recent actions

### 🎨 Modern Dark UI
- Ultra-dark intelligence dashboard aesthetic
- Glass-morphism cards with backdrop blur
- Smooth Framer Motion animations
- Responsive design for all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3.4, Framer Motion, Recharts, Zustand, TanStack Query |
| **Backend** | Node.js, Express 4.19, JWT Authentication, Joi Validation |
| **Database** | PostgreSQL with full schema (users, leads, outreach, templates, campaigns) |
| **AI** | OpenRouter API (Gemini, GPT, Claude, Llama — configurable) |
| **APIs** | Google Places API, Google PageSpeed API |
| **Queue** | Bull + Redis for background jobs (search & email) |
| **Email** | Nodemailer (Gmail SMTP / SendGrid) |

---

## 📁 Project Structure

```
LeadHunter-Pro/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/                # Axios API layer
│   │   ├── components/
│   │   │   ├── dashboard/      # StatsRow, PipelineBoard, ActivityFeed
│   │   │   ├── layout/         # Sidebar, TopBar, Layout
│   │   │   ├── leads/          # LeadCard, LeadFilters, BulkActionBar
│   │   │   ├── outreach/       # EmailComposer, CallScript, SequenceBuilder
│   │   │   ├── search/         # SearchPanel, ScanAnimation, ResultsPreview
│   │   │   └── ui/             # Button, Card, Modal, Badge, DataTable, etc.
│   │   ├── hooks/              # useAuth, useLeads, useSearch, useAI, etc.
│   │   ├── pages/              # Dashboard, LeadSearch, LeadDetail, etc.
│   │   ├── store/              # Zustand stores
│   │   └── utils/              # Score calculator, template engine, export
│   └── package.json
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── config/             # env, db, initDb
│   │   ├── controllers/        # auth, leads, search, outreach, ai
│   │   ├── middleware/          # auth, validation, rate limiting, errors
│   │   ├── models/             # User, Lead, OutreachLog, EmailTemplate, Campaign
│   │   ├── routes/             # REST API routes
│   │   ├── services/           # Google Places, website checker, scraper, AI, email
│   │   └── jobs/               # Bull queue workers
│   ├── server.js
│   └── package.json
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** 16+
- **Redis** (for background job queues)

### 1. Clone the repo
```bash
git clone https://github.com/saisuchindra/LeadHunter-Pro.git
cd LeadHunter-Pro
```

### 2. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:

| Variable | Description | Where to get it |
|----------|-------------|----------------|
| `DATABASE_URL` | PostgreSQL connection string | Your local/hosted Postgres |
| `JWT_SECRET` | Random secret for auth tokens | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `GOOGLE_PLACES_API_KEY` | Google Places API key | [Google Cloud Console](https://console.cloud.google.com/apis/library/places-backend.googleapis.com) |
| `GOOGLE_PAGESPEED_API_KEY` | PageSpeed Insights key | [Google Cloud Console](https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com) |
| `OPENROUTER_API_KEY` | AI API key | [OpenRouter](https://openrouter.ai/keys) |
| `SMTP_USER` / `SMTP_PASS` | Gmail + App Password | [Google App Passwords](https://myaccount.google.com/apppasswords) |

### 4. Initialize the database
```bash
cd server
node src/config/initDb.js
```

### 5. Start the app
```bash
# Terminal 1 — Backend (port 5000)
cd server && node server.js

# Terminal 2 — Frontend (port 3000)
cd client && npx vite --port 3000
```

Open **http://localhost:3000** — register an account and start hunting leads!

---

## 📸 Screenshots

| Dashboard | Lead Search | Lead Detail |
|-----------|------------|-------------|
| Pipeline board, charts, stats | Scan config, AI suggestions | AI analysis, call scripts |

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List leads (with filters) |
| GET | `/api/leads/:id` | Get lead detail |
| POST | `/api/leads` | Create lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search/scan` | Scan for businesses |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-email` | AI-generated outreach email |
| POST | `/api/ai/generate-call-script` | AI-generated call script |
| POST | `/api/ai/analyze-lead` | AI lead analysis |
| GET | `/api/ai/suggest-searches` | AI search suggestions |

### Outreach
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/outreach/email` | Send email to lead |
| POST | `/api/outreach/log-call` | Log a call |
| GET | `/api/outreach/:leadId` | Get outreach logs |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Dashboard stats |
| GET | `/api/analytics/daily` | Daily lead chart data |
| GET | `/api/analytics/categories` | Category breakdown |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| **Mint** (primary) | `#00FFB2` |
| **Coral** (danger) | `#FF4D6D` |
| **Violet** (accent) | `#7B61FF` |
| **Dark** (background) | `#0A0A0F` |
| **Display Font** | Syne |
| **Body Font** | DM Mono |

---

## 📄 License

MIT — free for personal and commercial use.

---

Built with ☕ and AI by [saisuchindra](https://github.com/saisuchindra)
