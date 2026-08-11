# ScanDeck — AI-Powered Website Audit & Optimization Tool

Enter any public URL and get a Lighthouse-based audit (Performance, SEO,
Accessibility, Best Practices) plus AI-generated, plain-English fix
recommendations. Scan history is kept per browser so you can track a site's
improvement over time.

Deployed on Render: [https://scandeck-client.onrender.com/](https://scandeck-client.onrender.com/)

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


