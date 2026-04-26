# StandBy PWA

An ambient always-on standby display — like iPhone StandBy mode, but available anytime on any device (iPhone, iPad, laptop).

## Features

- **Widgets**: Clock (analog/digital), Date, Weather, Calendar, Spotify Music, Photo Slideshow
- **Fully themeable**: AMOLED Black, Dark, Light, Retro CRT, Neon — plus live **Custom CSS editor**
- **Screen protection**: Pixel shift anti-burn-in, auto-dim, Wake Lock API
- **PWA**: Install to home screen, works offline

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. On iOS/iPad: tap **Share → Add to Home Screen**.

## Setup

Tap the ⚙ button (top-right) to open settings:

| Tab | What to configure |
|-----|------------------|
| **Layout** | Switch/create profiles, toggle edit mode to drag & reposition widgets |
| **Theme** | Pick a preset or write custom CSS (scoped to `.standby-canvas`) |
| **Widgets** | Add widgets, upload photos, manage calendar events |
| **Screen** | Pixel shift interval, auto-dim delay & brightness, Wake Lock |
| **APIs** | OpenWeatherMap API key + city, Spotify Client ID |

### Weather
1. Get a free API key at [openweathermap.org](https://openweathermap.org/api)
2. Enter key + city name in **Settings → APIs**

### Spotify
1. Create an app at [developer.spotify.com](https://developer.spotify.com/dashboard)
2. Add your app URL as a **Redirect URI** (e.g. `http://localhost:5173`)
3. Enter Client ID in **Settings → APIs**, then click **Connect Spotify** on the Music widget

## Production Build

```bash
npm run build
npm run preview
```

## Icons (for home screen install)
Replace `public/icons/icon-192.png` and `public/icons/icon-512.png` with actual PNG icons.
Generate them from `public/favicon.svg` at [favicon.io](https://favicon.io) or [realfavicongenerator.net](https://realfavicongenerator.net).

---

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys on every push to `main`. Your live URL will be:

```
https://<your-username>.github.io/<your-repo-name>/
```

### One-time setup

**Step 1 — Push the repo to GitHub**

```bash
cd standby-pwa

git init
git add .
git commit -m "Initial commit"

# Create a repo on github.com first, then:
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

**Step 2 — Enable GitHub Pages**

1. Go to your repo on GitHub
2. **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Save

The workflow will trigger automatically on the next push. Check the **Actions** tab to watch it run (~1 min). Your app will be live at the URL above.

**Step 3 — Update Spotify Redirect URI** *(if using Spotify)*

In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), add your live URL as a Redirect URI:
```
https://<your-username>.github.io/<your-repo-name>/
```

### Future deploys

Just push to `main` — GitHub Actions handles the rest:

```bash
git add .
git commit -m "Update something"
git push
```

