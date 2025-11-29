# 🌟 Carinae - AI-Powered Financial Intelligence Platform

<div align="center">

![Carinae Banner](https://img.shields.io/badge/Team-Carinae-blue?style=for-the-badge)
[![MoneyFyi](https://img.shields.io/badge/MoneyFyi-AI_CFO-green?style=for-the-badge)](MoneyFyi-Business/)
[![Status](https://img.shields.io/badge/Status-Hackathon_Project-orange?style=for-the-badge)](.)

**Mumbai Hackathon 2025 | Fintech Track**

*"Detect Problems Before They Hurt You"*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Project Architecture](#-project-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Projects in This Repository](#-projects-in-this-repository)
- [Getting Started](#-getting-started)
- [AI Agents](#-ai-agents)
- [Team](#-team)
- [Documentation](#-documentation)
- [License](#-license)

---

## 🎯 Overview

**Carinae** is a comprehensive AI-powered financial intelligence platform developed for the Mumbai Hackathon 2025. Our solution addresses critical challenges faced by Small and Medium Enterprises (SMEs) and individual users in India through two specialized applications:

1. **MoneyFyi-Business**: AI CFO for SMEs - Fraud detection, compliance tracking, and cashflow forecasting
2. **MoneyFyi-User**: Personal finance management with agentic AI-powered investment recommendations

---

## 🚨 Problem Statement

### For SMEs (MoneyFyi-Business)

Small and medium enterprises in India, especially retail shops and local counters, struggle with:

-  **Financial Fraud**: Unauthorized transactions and digital payment frauds in UPI/online payments
-  **Compliance Penalties**: Delayed or incorrect GST/TDS compliance leading to penalties
-  **Cashflow Issues**: Late payments, unexpected shortages, and poor financial planning
-  **Manual Processes**: Traditional apps lack real-time analysis and proactive guidance

### For Individuals (MoneyFyi-User)

-  **Irregular Income**: Gig workers and informal sector employees struggle with savings
-  **Generic Advice**: Lack of personalized financial recommendations
-  **Language Barriers**: Financial literacy content not available in regional languages
-  **Investment Complexity**: Difficulty in choosing appropriate moderate-risk investments

---

## 💡 Our Solution

### Agentic AI Challenge Solution

We developed an **AI-agent system** that autonomously:

✅ **Analyzes** uploaded transaction data, statements, and invoices using OCR + NLP  
✅ **Detects** anomalies, mismatches, fraud patterns, and compliance risks  
✅ **Predicts** cash-flow forecasts and investment opportunities  
✅ **Provides** proactive alerts and actionable insights in real-time  
✅ **Delivers** recommendations via user-friendly dashboards and WhatsApp notifications

---

## 🏗️ Project Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────┐
│              User Interface Layer                    │
│  Web Dashboard (Next.js) + Mobile PWA + WhatsApp    │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│         Document Processing Layer                    │
│  OCR (Google Gemini Vision) + Parsing + Validation  │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│            Multi-Agent AI Engine                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Data Normalizer Agent                       │   │
│  │  ↓                                           │   │
│  │  FraudGuard Agent → Compliance Mate Agent    │   │
│  │  ↓                   ↓                       │   │
│  │  Cashflow Oracle → SmartPayment Agent        │   │
│  │  ↓                                           │   │
│  │  Insight Agent (Recommendations)             │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│         Data & Storage Layer                         │
│  Supabase PostgreSQL + AES-256 Encrypted Storage    │
└─────────────────────────────────────────────────────┘
```

### Security Architecture

```
User Data → AES Encryption (Client) → HTTPS/TLS 1.3 → 
FastAPI Backend → Argon2 KDF → Second-Layer AES-256 → 
PostgreSQL (Encrypted at Rest) → Row Level Security (RLS)
```

**Data Privacy Compliance**: DPDP Act 2023, RBI Guidelines, ISO 27001 principles

---

## ✨ Key Features

### 🛡️ MoneyFyi-Business (SME Focus)

#### Fraud Detection & Prevention
- **Real-time Fraud Scoring**: Analyze transactions using 10+ fraud indicators
- **Duplicate Payment Detection**: UTR/reference number validation
- **Velocity Checks**: Detect rapid-fire transactions (potential attacks)
- **Round-Amount Flagging**: Identify suspicious payment patterns
- **New Vendor Alerts**: Flag first-time vendors for verification
- **After-Hours Alerts**: Detect unusual timing (weekends, late nights)

#### Compliance Automation
- **GST Invoice Validation**: GSTIN format checks, HSN/SAC code verification
- **TDS Calculation**: Automatic 10% TDS verification for services
- **Filing Reminders**: Quarterly GST deadlines with 3-day advance alerts
- **Document Preparation**: Auto-generate compliance reports
- **Penalty Avoidance**: Mismatch detection before filing

#### Cashflow Forecasting
- **7-30 Day Predictions**: AI-powered balance forecasting
- **Seasonal Analysis**: Pattern recognition for recurring cycles
- **Shortage Alerts**: Proactive warnings before cash crunch
- **Vendor Risk Scoring**: Payment delay analysis (0-100 scale)
- **Budget Recommendations**: Optimize spending based on forecast

#### Smart Payments
- **Vendor Verification**: Background checks for new vendors
- **Split Payment Logic**: Partial payments based on cashflow stress
- **Payment Prioritization**: Rank payments by urgency and risk
- **Fraud Prevention**: Block/review high-risk transactions

#### Alert System
- 🔴 **Critical**: Suspected fraud (immediate WhatsApp alert)
- 🟠 **High**: Compliance deadline <3 days
- 🟡 **Medium**: Cashflow shortage forecast
- 🟢 **Low**: Weekly summary reports

### 👤 MoneyFyi-User (Personal Finance)

#### Investment Recommendations
- **Personalized Portfolios**: Based on income, risk profile, and goals
- **Market Sentiment Analysis**: FinBERT + IndicBERT for news analysis
- **Stock & Mutual Fund Suggestions**: Moderate-risk, data-driven picks
- **Explainable AI**: Clear reasoning for every recommendation

#### Multi-Agent Intelligence
- **FinAgent (FinBERT)**: English financial news sentiment extraction
- **IndicAgent (IndicBERT)**: Regional language news & sentiment analysis
- **VoxAgent (VoxMind ASR)**: Voice input in Indian languages
- **TrendAgent (LSTM/Transformer)**: Price pattern forecasting
- **FusionAgent (Reinforcement Learning)**: Adaptive learning from user behavior

#### Financial Features
- **Expense Tracking**: Automatic categorization and insights
- **Savings Goals**: Track progress toward financial milestones
- **Investment Monitoring**: Portfolio performance tracking
- **Financial Literacy**: Educational content in English + Hindi
- **Voice Interaction**: Speak queries in regional languages

---

## 🛠️ Tech Stack

### Frontend (Both Projects)
```json
{
  "framework": "Next.js 16 (App Router)",
  "language": "TypeScript 5.0",
  "styling": "Tailwind CSS v4 + shadcn/ui",
  "charts": "Recharts",
  "state": "React Hooks + Context API",
  "forms": "React Hook Form + Zod",
  "auth": "Supabase Auth (JWT)",
  "pwa": "Service Worker + Manifest"
}
```

### Backend (Both Projects)
```python
{
  "framework": "FastAPI (Python 3.11+)",
  "database": "Supabase (PostgreSQL + RLS)",
  "ai_engine": "Google Gemini 1.5 Flash",
  "nlp_models": ["FinBERT", "IndicBERT", "RoBERTa"],
  "ocr": "Google Gemini Vision API",
  "ml_forecasting": ["Prophet", "LSTM", "ARIMA"],
  "storage": "Supabase Storage (AES-256)",
  "notifications": "n8n Webhooks (WhatsApp via Twilio - planned)"
}
```

### AI/ML Stack
```
NLP: FinBERT, IndicBERT, RoBERTa, VoxMind ASR
Vision: Google Gemini Vision, PaddleOCR
Forecasting: Meta Prophet, LSTM, Transformer, ARIMA
Anomaly Detection: Isolation Forest, DBSCAN, Z-score
Orchestration: LangChain
```

### Infrastructure
```
Hosting: Vercel (Frontend), Railway/Render (Backend)
Database: Supabase PostgreSQL (with RLS)
Cache: Redis (Upstash)
Task Queue: Celery (planned)
Monitoring: Sentry (planned)
Analytics: Vercel Analytics, PostHog (planned)
```

---

## 📦 Projects in This Repository

### 1. MoneyFyi-Business (SME Solution)

**Purpose**: AI CFO for small businesses - fraud detection, compliance, cashflow management

**Structure**:
```
MoneyFyi-Business/
├── Backend/
│   ├── ai_engine/              # AI agents (fraud, cashflow, compliance)
│   │   ├── fraudguard_agent.py
│   │   ├── cashflow_oracle.py
│   │   ├── compliance_mate_agent.py
│   │   ├── smartpayment_agent.py
│   │   └── insight_agent.py
│   ├── app/
│   │   ├── routers/            # API endpoints
│   │   ├── services/           # Business logic
│   │   ├── models/             # Data models
│   │   └── main.py             # FastAPI app
│   └── requirements.txt
├── Frontend/
│   ├── app/                    # Next.js pages
│   ├── components/             # React components
│   └── package.json
├── tests/                      # Automated tests
├── README.md
└── sample_analysis_output.json
```

**Key APIs**:
- `POST /api/v1/documents` - Upload & process documents
- `GET /api/v1/transactions` - Query transactions
- `GET /api/v1/alerts` - Retrieve alerts
- `GET /api/v1/insights/executive-summary` - Get AI insights

**Documentation**: [MoneyFyi-Business README](MoneyFyi-Business/README.md)

---

### 2. MoneyFyi-User (Personal Finance)

**Purpose**: Personal finance management with AI-powered investment recommendations

**Structure**:
```
MoneyFyi-User/
├── Backend/
│   ├── app/
│   │   ├── api/v1/             # API routes
│   │   ├── models/             # User, transaction models
│   │   └── main.py
│   └── requirements.txt
├── Frontend/
│   ├── app/                    # Next.js App Router
│   ├── components/
│   └── package.json
└── ML/
    ├── app/
    │   ├── agents/             # FinAgent, IndicAgent, etc.
    │   └── main.py
    ├── notebooks/              # Jupyter notebooks for training
    └── requirements.txt
```

**Key Features**:
- Agentic AI with 6 specialized agents
- Multilingual support (English + Hindi)
- Voice interaction (VoxMind ASR)
- Sentiment-driven recommendations
- Continuous learning from user behavior

**Documentation**: See individual README files in MoneyFyi-User/

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm/yarn
- **Python** 3.11+
- **Supabase** account (free tier works)
- **Google AI Studio** account (for Gemini API key)

### Quick Start (MoneyFyi-Business)

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/carinae.git
cd carinae/MoneyFyi-Business
```

#### 2. Setup Backend
```bash
cd Backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Create .env file
echo "SUPABASE_URL=your_supabase_url" > .env
echo "SUPABASE_SERVICE_ROLE_KEY=your_service_key" >> .env
echo "GEMINI_API_KEY=your_gemini_key" >> .env
echo "N8N_WEBHOOK_URL=your_webhook_url" >> .env

# Run backend
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

#### 3. Setup Frontend
```bash
cd ../Frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local

# Run frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

#### 4. Setup Database (Supabase)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Go to **SQL Editor**
4. Run the migration scripts in `Frontend/scripts/` in order:
   - `001_create_profiles.sql`
   - `002_create_transactions.sql`
   - `003_create_vendors.sql`
   - `004_create_alerts.sql`
   - `005_create_cashflow_forecasts.sql`
   - `006_create_documents.sql`

---

### Quick Start (MoneyFyi-User)

Follow similar steps for MoneyFyi-User project. See specific README files:
- [Backend README](MoneyFyi-User/Backend/README.md)
- [Frontend README](MoneyFyi-User/Frontend/README.md)
- [ML README](MoneyFyi-User/ML/README.md)

---

## 🤖 AI Agents

### MoneyFyi-Business Agents

| Agent | Technology | Purpose | Key Features |
|-------|-----------|---------|--------------|
| **Data Normalizer** | Pandas, NumPy | Clean & structure data | Transaction categorization, amount normalization |
| **FraudGuard** | Isolation Forest, Rule Engine | Fraud detection | 10+ fraud indicators, risk scoring (0-100) |
| **ComplianceMate** | Rule Engine, GST API | Tax compliance | GST validation, TDS checks, filing reminders |
| **Cashflow Oracle** | Prophet, ARIMA | Cashflow forecasting | 7-30 day predictions, seasonal analysis |
| **SmartPayment** | Decision Tree, RL | Payment recommendations | Vendor risk scoring, split payment logic |
| **Insight Agent** | Google Gemini LLM | Natural language insights | Executive summaries, action items |

### MoneyFyi-User Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| **FinAgent** | FinBERT | English financial news sentiment |
| **IndicAgent** | IndicBERT | Regional language sentiment |
| **InsightAgent** | RoBERTa | User intent understanding |
| **VoxAgent** | VoxMind ASR | Voice-to-text (Indian languages) |
| **TrendAgent** | LSTM/Transformer | Price forecasting |
| **FusionAgent** | Reinforcement Learning | Adaptive recommendations |

---

## 👥 Team

**Team Carinae** - Mumbai Hackathon 2025

- **Rajath U** - Full Stack Development, AI Integration
- **Niharika Trivedi** - Backend Development, Database Design
- **Aditya S Hegde** - ML Engineering, AI Agent Development
- **Jayesh RL** - Frontend Development, UI/UX Design

---

## 📚 Documentation

### MoneyFyi-Business
- [Main README](MoneyFyi-Business/README.md)
- [Backend Documentation](MoneyFyi-Business/Backend/BACKEND_DOCUMENTATION.md)
- [API Specification](MoneyFyi-Business/Backend/API_SPEC.md)
- [Database Schema](MoneyFyi-Business/Backend/DATABASE_SCHEMA.md)
- [Architecture](MoneyFyi-Business/Backend/ARCHITECTURE.md)
- [Contributing Guide](MoneyFyi-Business/CONTRIBUTING.md)

### MoneyFyi-User
- [Backend README](MoneyFyi-User/Backend/README.md)
- [Frontend README](MoneyFyi-User/Frontend/README.md)
- [ML Service README](MoneyFyi-User/ML/README.md)

### Reference Documents
- [Hackathon Presentation (PDF)](docs/Mumbai_hackathon_PPt_123[1].pdf)
- [MoneyFyi-Business Technical Spec (PDF)](docs/MoneyFyi-Business.pdf)
- [MoneyFyi-User Technical Spec (PDF)](docs/MoneyFyi-User.pdf)

---

## 🔒 Security & Compliance

### Data Privacy (DPDP Act 2023)
✅ Explicit user consent for data processing  
✅ AES-256 encryption for sensitive data  
✅ Right to erasure (data deletion API)  
✅ Breach notification within 72 hours  

### RBI Guidelines
✅ TLS 1.3 encrypted transmission  
✅ Multi-factor authentication (planned)  
✅ Audit logs for all data access  
✅ No storage of bank credentials  
✅ 15-minute session timeout  

### Technical Security
- **Encryption**: AES-256 (at rest), TLS 1.3 (in transit)
- **Authentication**: JWT tokens, Argon2 password hashing
- **Database**: Row Level Security (RLS) on all tables
- **API**: Rate limiting, CORS policies, input validation
- **Monitoring**: Error tracking, access logs

---


## 💰 Business Model (Post-Beta)

### MoneyFyi-Business Pricing

| Tier | Price | Features |
|------|-------|----------|
| **Free** | ₹0 | 10 docs/month, basic alerts |
| **Starter** | ₹499/month | 100 docs/month, WhatsApp alerts |
| **Pro** | ₹1,499/month | Unlimited docs, API access, multi-user |
| **Enterprise** | Custom | White-label, on-premise, dedicated support |

### MoneyFyi-User Pricing

| Tier | Price | Features |
|------|-------|----------|
| **Free** | ₹0 | Basic tracking, 5 recommendations/month |
| **Premium** | ₹199/month | Unlimited recommendations, advanced analytics |
| **Family** | ₹299/month | 5 users, shared goals, priority support |

---

## 🏆 Competitive Advantages

1. **India-Specific**: Built for GST/TDS compliance (not generic)
2. **WhatsApp-First**: 500M+ WhatsApp users in India
3. **No Bank Integration**: Works with uploaded documents (privacy-first)
4. **Multi-Agent AI**: More accurate than single-model systems
5. **Agentic Approach**: Autonomous decision-making, not just recommendations
6. **Privacy-Focused**: AES-256 encryption, DPDP Act 2023 compliant
7. **Affordable**: ₹499/month vs ₹10,000+ for enterprise solutions
8. **Multilingual**: English + Hindi + regional languages (voice support)

---

## 🧪 Testing

### Run Backend Tests
```bash
cd MoneyFyi-Business/Backend
pytest tests/
```

### Run Frontend Tests (Coming Soon)
```bash
cd MoneyFyi-Business/Frontend
npm test
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](MoneyFyi-Business/CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact & Support

- **Project Website**: Coming soon
- **Email**: support@moneyfyi.com
- **LinkedIn**: [Team Carinae](https://linkedin.com/company/carinae)
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/carinae/issues)

---

## 🙏 Acknowledgments

### Technologies
- [Next.js](https://nextjs.org/) - React Framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python API
- [Supabase](https://supabase.com/) - Backend Platform
- [Google AI](https://ai.google.dev/) - Gemini API
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Vercel](https://vercel.com/) - Hosting Platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework

### Research & Standards
- RBI Authentication Mechanisms for Digital Payment Transactions (2025)
- RBI Master Direction on Regulation of Payment Aggregators (2025)
- India's DPDP Act (Digital Personal Data Protection Act, 2023)
- Information Technology Act, 2000 (with amendments)
- The Payment and Settlement Systems Act, 2007
- The Prevention of Money Laundering Act (PMLA), 2002

### Academic Papers
- "UPI Based Financial Fraud Detection Using Deep Learning"
- "FAMOS: Robust Privacy-Preserving Authentication"
- "Secure Use of the Agent Payments Protocol (AP2)"

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

<div align="center">

### 🚀 Built with ❤️ by Team Carinae for Mumbai Hackathon 2025

**MoneyFyi** - *Detect Problems Before They Hurt You*

Made in India 🇮🇳 | Fintech Track | Agentic AI Challenge

[Website](#) • [Demo](#) • [Documentation](docs/) • [Support](#)

</div>
