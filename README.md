# Ä/Bilden — MVP (Consultation citoyenne par consentement)

Cloud-native spine: Netlify (PWA) · Render (FastAPI) · Supabase (Auth/DB) · Google Drive/Sheets (exports) · EmailJS (transactional emails).

## What’s inside
- `web/` — Vite + React PWA (FR/DE/LU ready) with swipe UI → saves votes to Supabase.
- `api/` — FastAPI service (exports JSON/PDF stubs, webhooks for round open/close).
- `supabase/ddl.sql` — Full PostgreSQL DDL (Supabase) incl. RLS policies.
- `netlify.toml` — Netlify config for PWA build/redirects.
- `render.yaml` — Render service definition for `api/`.
- `.env.example` — Environment variables for local/dev.

## Quickstart

### 0) Prereqs
- Node 20+, Python 3.11+, `pip`, `npm` or `pnpm`, Supabase project, Netlify + Render accounts.

### 1) Database (Supabase)
- Create a new project → copy your anon and service keys.
- Run the DDL:
```bash
psql < supabase/ddl.sql
```
(or paste into Supabase SQL editor).

### 2) Frontend (Netlify or local dev)
```bash
cd web
cp .env.example .env
# Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm i
npm run dev
# or build for Netlify
npm run build
```
- Deploy on Netlify: select `web/` as base, build command `npm run build`, publish dir `dist`.

### 3) Backend (Render or local dev)
```bash
cd api
cp .env.example .env
# Fill SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, GOOGLE_DRIVE_FOLDER_ID, EMAILJS IDs if used
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Deploy on Render with `render.yaml`.

### 4) First run
- Seed a few `proposals` rows in Supabase.
- Open the web app → swipe & record votes.
- Use `/api/export/decision-json/{proposal_id}` to fetch a stub export; adapt to your Drive/EmailJS flows.

## Repo workflow
1. Create a new GitHub repo and push this folder.
2. Set up Netlify (frontend) and Render (backend).
3. Add Supabase URL/Keys to both projects' environment settings.
4. Iterate: implement clarification → reaction → consent rounds, objections, decisions.

---

**Note**: This MVP favors simplicity. Tighten RLS, add rate limits, and expand the export/Drive/EmailJS adapters before production.
