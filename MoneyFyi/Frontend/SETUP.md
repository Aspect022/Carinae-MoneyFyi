# MoneyFyi Local Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Supabase account and project

## Steps to Run Locally

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd moneyfyi
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
pnpm install
# or
yarn install
\`\`\`

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Then fill in the values:

**Get Supabase Credentials:**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

**Get Database Credentials:**
1. In Supabase Dashboard, go to **Settings** → **Database**
2. Scroll to **Connection String**
3. Copy the connection strings for:
   - URI (for `POSTGRES_URL`)
   - Transaction pooler (for `POSTGRES_PRISMA_URL`)
   - Session pooler (for `POSTGRES_URL_NON_POOLING`)

### 4. Set Up Database Schema

The SQL scripts are in the `/scripts` folder. You can run them in Supabase:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run each script in order:
   - `001_create_profiles.sql`
   - `002_create_transactions.sql`
   - `003_create_vendors.sql`
   - `004_create_alerts.sql`
   - `005_create_cashflow_forecasts.sql`
   - `006_create_documents.sql`

Or use the Supabase CLI:
\`\`\`bash
supabase db push
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Login Credentials (Mock Auth)

For the current mock authentication:
- **Email:** admin@moneyfyi.com
- **Password:** admin123

## Features

- ✅ Dashboard with financial metrics
- ✅ Transaction history with filtering
- ✅ File upload system
- ✅ Reports generation
- ✅ Vendor risk analysis
- ✅ Cashflow forecasting
- ✅ Compliance tracking
- ✅ Dark/Light mode toggle
- ✅ Mobile responsive with PWA support

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS v4 with semantic design tokens
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (currently mock for demo)
- **Charts:** Recharts
- **Icons:** Lucide React

## Troubleshooting

**If the site shows errors:**
1. Check that all environment variables are set correctly
2. Verify Supabase project is active
3. Ensure database tables are created
4. Clear browser cache and restart dev server

**CSS errors:**
- Make sure Tailwind CSS v4 is properly configured
- Check that globals.css has no syntax errors

**Auth issues:**
- Currently using mock auth - check localStorage for `moneyfyi_user`
- For real Supabase auth, uncomment middleware and auth logic
