# ScanDeck — AI-Powered Website Audit & Optimization Tool

Enter any public URL and get a Lighthouse-based audit (Performance, SEO,
Accessibility, Best Practices) plus AI-generated, plain-English fix
recommendations. Scan history is kept per browser so you can track a site's
improvement over time.

Deployed on Render: [scandeck-client.onrender.com](https://scandeck-client.onrender.com/)

**Stack:** React (Vite) + Bootstrap on the frontend, Node/Express backend,
Google PageSpeed Insights API for the audit, Gemini API for recommendations.

```
website-audit-tool/
├── client/     React + Vite + Bootstrap frontend
└── server/     Express backend (talks to the Gemini API)
```

## 1. Prerequisites

- [Node.js](https://nodejs.org) v18 or later (check with `node -v`)
- A free **Google PageSpeed Insights API key**
- A free **Gemini API key**

### Get the PageSpeed Insights API key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or use an existing one).
3. Go to **APIs & Services → Library**, search for **"PageSpeed Insights API"**, and click **Enable**.
4. Go to **APIs & Services → Credentials → Create Credentials → API key**. Copy it.

### Get the Gemini API key
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in and click **Create API key**. Copy it.

## 2. Run the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and paste in your Gemini key:

```
PORT=5000
GEMINI_API_KEY=paste_your_gemini_key_here
GEMINI_MODEL=gemini-flash-latest
CLIENT_ORIGIN=http://localhost:5173
```

Start the server:

```bash
npm start
```

You should see: `Website audit backend running on http://localhost:5000`
Leave this terminal running.

## 3. Run the frontend

Open a **second terminal**:

```bash
cd client
npm install
cp .env.example .env
```

Open `client/.env` and fill in your PageSpeed key:

```
VITE_PAGESPEED_API_KEY=paste_your_pagespeed_key_here
VITE_API_BASE_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Open the URL it prints (usually **http://localhost:5173**) in your browser.
Type a URL like `wikipedia.org` and click **Scan site**.

## 4. How it works

1. `client` calls Google's PageSpeed Insights API directly with the URL you enter and gets back a full Lighthouse report.
2. `pagespeedService.js` reshapes that report into 4 scores + a flat, sorted list of issues.
3. Clicking **Generate recommendations** sends a short summary (not the raw report) to your own `server`, which forwards it to Gemini and returns a prioritized action plan. Keeping this call on the backend keeps your Gemini key out of the browser.
4. Every completed scan is saved to `localStorage` (via `utils/storage.js`) so you can revisit past scans from the **Recent scans** panel — no database required.

## 5. Pushing to GitHub

From the `website-audit-tool` folder:

```bash
git init
git add .
git commit -m "Initial commit: ScanDeck website audit tool"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Your `.env` files are already excluded by `.gitignore`, so your API keys will
**not** be pushed. Only `.env.example` (with placeholder text) goes to GitHub.

## 6. Deploying (free tiers)

You'll deploy `client` and `server` as two separate services.

### Deploy the backend (`server`) on Render
1. Go to [render.com](https://render.com) → sign in with GitHub.
2. **New → Web Service** → select your repo.
3. Set **Root Directory** to `server`.
4. **Build Command:** `npm install` **Start Command:** `npm start`
5. Under **Environment**, add the same variables from `server/.env`:
   - `GEMINI_API_KEY` = your key
   - `CLIENT_ORIGIN` = (leave for now, update after step below)
6. Click **Create Web Service**. Once deployed, copy the live URL, e.g. `https://scandeck-server.onrender.com`.

### Deploy the frontend (`client`) on Vercel
1. Go to [vercel.com](https://vercel.com) → sign in with GitHub.
2. **Add New → Project** → select your repo.
3. Set **Root Directory** to `client`.
4. Framework preset: **Vite**.
5. Under **Environment Variables**, add:
   - `VITE_PAGESPEED_API_KEY` = your key
   - `VITE_API_BASE_URL` = the Render URL from the previous step (e.g. `https://scandeck-server.onrender.com`)
6. Click **Deploy**. Vercel gives you a live URL, e.g. `https://scandeck.vercel.app`.

### Final step: connect the two
Go back to your Render service → **Environment** → set `CLIENT_ORIGIN` to your
Vercel URL (e.g. `https://scandeck.vercel.app`) → save (Render redeploys
automatically). This lets your live frontend call your live backend.

Both platforms auto-redeploy every time you `git push` to `main`.

## 7. Notes for your resume / interview

- The PageSpeed API key is used client-side, which is standard for this
  public, quota-limited Google API — mention this as a conscious trade-off if asked.
- The backend exists specifically to keep the Gemini key server-side — a good
  talking point on API-key security practices.
- Scan history uses `localStorage` for zero-backend simplicity; a natural
  "next step" to mention is swapping it for a small database (e.g. MongoDB or
  Postgres) if asked how you'd scale it for multiple users.
