# TokScroll — TikTok scrolling web app

This is a GitHub-ready TikTok scrolling UI using TikTok's **Display API**.

## Important

A GitHub Pages site is static, so it cannot safely hold your TikTok client secret or perform the OAuth token exchange by itself. This project therefore uses:

- `index.html` — the scrolling frontend
- `api/` — serverless backend endpoints for OAuth + TikTok API calls
- Vercel (or another serverless host) — backend hosting
- GitHub — source code / optional frontend hosting

TikTok's Display API requires a TikTok developer app, Login Kit, Display API approval, and `user.info.basic` + `video.list` scopes.

## Deploy

### 1. Create a TikTok developer app

Use the TikTok Developer Portal and add Login Kit + Display API.

Set the redirect URI to:

`https://YOUR-VERCEL-DOMAIN/api/callback`

Also add your deployed domain as a trusted domain in TikTok's development configuration.

### 2. Put this repo on GitHub

Upload all files.

### 3. Deploy the repository to Vercel

Import the GitHub repository into Vercel.

Add these Environment Variables:

- `TIKTOK_CLIENT_KEY` = your TikTok client key
- `TIKTOK_CLIENT_SECRET` = your TikTok client secret
- `TIKTOK_REDIRECT_URI` = `https://YOUR-VERCEL-DOMAIN/api/callback`

Do **not** put the client secret in `index.html` or commit it to GitHub.

### 4. Open the Vercel URL

Click **Connect TikTok**, authorize the app, then scroll vertically like a short-video feed.

## What this version can do

- Full-screen vertical snap scrolling
- TikTok embed player
- TikTok OAuth login
- Load the authorized user's recent videos
- Mobile-friendly UI
- Works from a GitHub repository

## Limitation

This is **not a clone of TikTok's public For You feed**. The official Display API is designed to display an authorized creator's videos. A public, arbitrary-user discovery feed requires different TikTok products/permissions and is not something you should implement by scraping TikTok.

For a multi-user production app, replace the demo cookie session with a proper database/session system and implement refresh-token handling.
