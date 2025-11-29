# MoneyFyi - Your AI CFO for Small Businesses

<div align="center">
  <img src="Frontend/public/logo.png" alt="MoneyFyi Logo" width="200"/>
  
  ### "Detect Problems Before They Hurt You"
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
</div>

---

## 📋 Overview

**MoneyFyi** is an AI-driven financial intelligence dashboard that analyzes uploaded bank statements, invoices, and UPI data to detect fraud, identify compliance risks, and predict cashflow issues for Indian SMEs.

### The Problem

Small businesses in India lack financial awareness, leading to:
- 💸 **Fraud losses** from unauthorized transactions
- 📝 **GST/TDS errors** resulting in penalties
- ⏰ **Late payments** and cashflow shortages
- ✋ **Manual transaction checks** that miss critical issues

### The Solution

An AI-powered multi-agent system that autonomously:
- ✅ Analyzes financial documents (OCR + NLP)
- ✅ Detects anomalies and fraud patterns
- ✅ Validates GST/TDS compliance
- ✅ Forecasts cashflow shortages
- ✅ Sends WhatsApp alerts in real-time

---

## 🎯 Target Users

1. **Small & Medium Enterprises (SMEs)**
2. Retail shops, traders, and distributors
3. Freelancers and service providers
4. Small company finance teams
5. Chartered Accountants (CA firms managing multiple clients)

---

## ✨ Key Features

### 🛡️ Fraud Detection
- Suspicious transaction identification
- Duplicate payment detection
- Round-number transaction flagging
- Weekend/holiday large withdrawal alerts
- Invoice-payment mismatch detection

### 📊 Compliance Tracking
- GST invoice validation
- TDS deduction verification (10% for services)
- Quarterly GST filing deadline tracking
- GSTIN format validation
- HSN/SAC code verification

### 💰 Cashflow Forecasting
- 30-90 day cashflow predictions
- Seasonal pattern analysis
- Pending invoice tracking
- Recurring expense monitoring

### 📱 Smart Alerts
- 🔴 Critical: Suspected fraud (immediate)
- 🟠 High: Compliance deadline <3 days
- 🟡 Medium: Cashflow shortage forecast
- 🟢 Low: Weekly summary

### 📈 Vendor Risk Analysis
- Risk scoring (0-100)
- Payment pattern analysis
- Transaction history tracking
- Red flag identification

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│ 1. Upload Documents (Web/Mobile)        │
│ PDF, CSV, Images (Bank statements,      │
│ Invoices, UPI logs)                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. OCR & Data Extraction                │
│ PaddleOCR / OpenAI Vision               │
│ → Structured JSON                       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. Multi-Agent Analysis                 │
│ • Doc Scan Agent                        │
│ • Anomaly Detection Agent               │
│ • Compliance Agent                      │
│ • Cashflow Forecasting Agent            │
│ • Insight Generation Agent              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. Output & Alerts                      │
│ Dashboard + WhatsApp Notifications      │
└─────────────────────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Charts:** Recharts
- **State Management:** React Hooks
- **Icons:** Lucide React
- **PWA:** Service Worker + Manifest
- **Analytics:** Vercel Analytics

### Backend (Planned)
- **Framework:** FastAPI (Python 3.11)
- **Task Queue:** Redis + Celery
- **OCR:** PaddleOCR / OpenAI Vision
- **AI/ML:** scikit-learn, Prophet, LangChain
- **LLM:** OpenAI GPT-4 / Claude

### Database & Storage
- **Primary DB:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage (AES-256 encrypted)
- **Cache:** Redis (Upstash)
- **Auth:** Supabase Auth

### Integrations
- **WhatsApp:** Twilio API (planned)
- **Analytics:** PostHog (planned)
- **Monitoring:** Sentry (planned)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm, pnpm, or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moneyfyi.git
   cd moneyfyi/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the Frontend directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

   **Get Supabase Credentials:**
   - Go to your [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to **Settings** → **API**
   - Copy the Project URL and anon/public key

4. **Set up database schema**
   
   In Supabase Dashboard, go to **SQL Editor** and run the scripts in order:
   ```
   Frontend/scripts/001_create_profiles.sql
   Frontend/scripts/002_create_transactions.sql
   Frontend/scripts/003_create_vendors.sql
   Frontend/scripts/004_create_alerts.sql
   Frontend/scripts/005_create_cashflow_forecasts.sql
   Frontend/scripts/006_create_documents.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 Demo & Screenshots

### Landing Page
<img src="Frontend/public/modern-financial-dashboard-with-charts-and-alerts.jpg" alt="Landing Page" width="600"/>

### Dashboard with Alerts
<img src="Frontend/public/financial-dashboard-with-fraud-alerts-cashflow-cha.jpg" alt="Dashboard" width="600"/>

---

## 📂 Project Structure

```
MoneyFyi/
├── Frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── transactions/      # Transaction management
│   │   ├── reports/           # Reports generation
│   │   ├── upload/            # File upload interface
│   │   ├── settings/          # User settings
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   └── [feature-components]
│   ├── lib/                   # Utilities & helpers
│   │   ├── api/              # API client & mock data
│   │   ├── supabase/         # Supabase client
│   │   └── utils/            # Helper functions
│   ├── public/                # Static assets
│   ├── scripts/               # Database migration scripts
│   └── package.json
├── Docs/                      # Project documentation
│   └── MoneyFyi - Complete Project Blueprint.pdf
├── README.md
└── LICENSE
```

---

## 🎨 UI Design System

### Color Palette
- **Primary Green:** `#0F8F6E` (Trust, growth)
- **Accent Red:** `#FF4C4C` (Alerts, critical)
- **Warning Orange:** `#FFA500` (Medium priority)
- **Success Green:** `#00C853` (Positive indicators)
- **Background:** `#FFFFFF` (Clean, minimal)

### Typography
- **Headings:** Inter Bold, 24-32px
- **Body:** Inter Regular, 14-16px
- **Numbers:** SF Mono (monospaced)

---

## 📊 AI Agents (Implementation Roadmap)

### 1. Doc Scan Agent
- **Role:** Extract structured data from unstructured documents
- **Technology:** PaddleOCR, GPT-4/Claude, LangChain
- **Output:** Structured JSON with transactions

### 2. Anomaly Detection Agent
- **Role:** Identify suspicious patterns and fraud indicators
- **Models:** Isolation Forest, DBSCAN clustering, Z-score analysis
- **Target:** >85% Precision, >75% Recall, <10% False Positive Rate

### 3. Compliance Agent
- **Role:** GST/TDS validation and compliance tracking
- **Checks:** GST invoice validation, TDS verification, filing deadlines

### 4. Cashflow Forecasting Agent
- **Role:** Predict future cash positions
- **Technology:** Meta Prophet, Linear Regression
- **Forecast:** 30-90 day projections

### 5. Insight Generation Agent
- **Role:** Natural language summaries and recommendations
- **Technology:** GPT-4/Claude with structured prompts

### 6. Alert & Notification Agent
- **Role:** Real-time WhatsApp notifications
- **Integration:** Twilio API

---

## 🔒 Security & Compliance

### Data Privacy (DPDP Act 2023)
- ✅ Explicit user consent for data processing
- ✅ AES-256 encryption for sensitive data
- ✅ Right to erasure (data deletion API)
- ✅ Breach notification within 72 hours

### RBI Guidelines
- ✅ TLS 1.2+ encrypted transmission
- ✅ Multi-factor authentication
- ✅ Audit logs for all data access
- ✅ No storage of bank credentials
- ✅ 15-minute session timeout

---

## 📈 Roadmap

### Phase 1: MVP (Completed ✅)
- [x] Frontend UI with Next.js
- [x] Authentication system
- [x] File upload interface
- [x] Dashboard with mock data
- [x] Database schema
- [x] Mobile responsive design
- [x] PWA support

### Phase 2: AI Integration (In Progress 🚧)
- [ ] OCR pipeline implementation
- [ ] Anomaly detection agent
- [ ] Compliance validation agent
- [ ] Cashflow forecasting agent
- [ ] Insight generation

### Phase 3: Notifications & Alerts
- [ ] WhatsApp integration via Twilio
- [ ] Email notifications
- [ ] Real-time alert system
- [ ] Alert customization

### Phase 4: Advanced Features
- [ ] Multi-user/team support
- [ ] API for third-party integrations
- [ ] Advanced analytics
- [ ] Custom report builder
- [ ] Mobile apps (iOS/Android)

---

## 💰 Pricing (Post-Beta)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | ₹0 | 10 docs/month, basic alerts |
| **Starter** | ₹499/month | 100 docs/month, WhatsApp alerts |
| **Pro** | ₹1,499/month | Unlimited docs, API access, multi-user |
| **Enterprise** | Custom | White-label, on-premise, dedicated support |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for Indian SMEs

**Team Carinae | MoneyFyi**

---

## 📞 Contact & Support

- **Website:** [moneyfyi.com](https://moneyfyi.com) (coming soon)
- **Email:** support@moneyfyi.com
- **Twitter:** [@moneyfyi](https://twitter.com/moneyfyi)
- **LinkedIn:** [MoneyFyi](https://linkedin.com/company/moneyfyi)

---

## 🏆 Competitive Advantages

1. **India-Specific:** Built for GST/TDS compliance
2. **WhatsApp-First:** 500M+ WhatsApp users in India
3. **No Bank Integration:** Works with uploaded documents
4. **Multi-Agent AI:** More accurate than single-model systems
5. **Privacy-Focused:** AES-256 encryption, DPDP compliant
6. **Affordable:** Starting at ₹499/month vs enterprise solutions

---

## 📚 Documentation

- [Setup Guide](Frontend/SETUP.md)
- [Project Blueprint](Docs/MoneyFyi%20-%20Complete%20Project%20Blueprint.pdf)
- [API Documentation](docs/API.md) (coming soon)
- [Database Schema](docs/DATABASE.md) (coming soon)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Supabase](https://supabase.com/) - Backend Platform
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Vercel](https://vercel.com/) - Hosting Platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework

---

<div align="center">
  <strong>MoneyFyi - Detect Problems Before They Hurt You</strong>
  
  Made with ❤️ in India 🇮🇳
</div>
