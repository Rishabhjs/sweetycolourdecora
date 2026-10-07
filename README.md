# Sweety Colour Decora — Architectural Studio, AI Estimator & Construction OS

> **Building Landmarks Since 2003**  
> Luxury architectural interior finishes, grounded AI spatial estimation, and real-time Construction OS enterprise field telemetry.

---

## 🏛️ Project Architecture

* **Frontend:** Luxury architectural dark-mode editorial experience with interactive Before/After split comparison sliders, coverflow 3D showcase, and modal booking dialogs.
* **AI Design Studio:** Spatial geometry analysis, RAG-grounded itemized BOQ contractor cost calculations, multi-city index calibration, and perspective-aligned 4K concept transformations.
* **Construction OS:** Enterprise site management with SQLite / Supabase database grounding:
  * Projects Ledger & Financial Variance Tracking
  * Workforce Roster & Daily Attendance
  * Materials Procurement & Site Photo Logs
  * Project AI Assistant with natural-language database query engine
* **Database:** Native SQLite locally (`construction.sqlite`) + Cloud PostgreSQL schema for **Supabase**.
* **Deployment:** Pre-configured for zero-friction **Vercel** serverless deployment.

---

## 🚀 1. Push to GitHub

To upload this repository to your GitHub account:

```bash
# 1. Initialize and add files (already prepared)
git init
git add .
git commit -m "feat: Sweety Colour Decora v2.0 - Luxury Studio, AI Estimator & Construction OS"

# 2. Add your GitHub remote repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sweety-colour-decora.git

# 3. Push to main branch
git branch -M main
git push -u origin main
```

---

## ⚡ 2. Deploy to Vercel

### Option A: 1-Click via Vercel Dashboard
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Select your `sweety-colour-decora` GitHub repository.
3. Keep default settings (Vercel automatically detects `vercel.json`).
4. Click **Deploy**.

### Option B: Deploy via Vercel CLI
```bash
npx vercel
# Follow the prompts to link and deploy to production:
npx vercel --prod
```

### Environment Variables on Vercel
In your Vercel Project Settings $\rightarrow$ **Environment Variables**, add:
* `OPENAI_API_KEY` (optional, for OpenAI-powered analysis)

The Vercel deployment uses Node.js 22. The current application database is SQLite, so data written by serverless functions is stored only in the function's temporary `/tmp` directory and is not durable across cold starts or separate function instances. Supabase credentials alone do not change this; the application routes must be migrated to Supabase before using this deployment for persistent project, lead, or workforce records. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` only after that integration is implemented.

---

## 🗄️ 3. Setup Supabase Database

1. Create a free project at [https://supabase.com](https://supabase.com).
2. Navigate to your Supabase Project $\rightarrow$ **SQL Editor**.
3. Open `supabase_schema.sql` from this repository, paste the contents into the SQL Editor, and click **Run**.
4. All tables (`projects`, `workers`, `attendance`, `work_items`, `material_purchases`, `expenses`, `daily_reports`, `leads`) and seed data will be created with Row Level Security enabled.
5. (Optional) Run `npm run migrate:supabase` to sync existing local SQLite records directly into Supabase.

---

## 🛠️ Local Development

```bash
# Start the local server
npm start
# Open in browser: http://localhost:3000
```
