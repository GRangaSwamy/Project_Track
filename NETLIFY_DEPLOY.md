# 🚀 Netlify Deployment Guide — ConstructaX

> **Stack:** Vite + React + Firebase (Auth + Firestore) + Cloudinary  
> **Type:** Pure frontend SPA — no backend / serverless functions needed  
> **Build Output:** `dist/`

---

## 📁 Final Project Structure

```
Track/
├── src/                            # React source code
│   ├── config/
│   │   └── firebase.config.js      # Reads VITE_* env vars
│   ├── services/
│   │   ├── firebase.js             # Firebase init
│   │   ├── cloudinaryService.js    # Unsigned Cloudinary uploads
│   │   └── ...                     # Other services
│   ├── pages/                      # Route pages
│   ├── components/                 # Reusable components
│   └── main.jsx                    # App entry point
├── public/                         # Static assets
├── dist/                           # ✅ Built output (Netlify publishes this)
├── netlify.toml                    # ✅ Netlify configuration
├── vite.config.js                  # ✅ Build config (outDir: dist)
├── .env                            # ❌ Local only — NEVER commit this
├── .env.example                    # ✅ Safe template to commit
└── .gitignore                      # ✅ Excludes .env and dist/
```

---

## 🔧 What Was Changed for Netlify Compatibility

| File | Change | Reason |
|------|--------|--------|
| `netlify.toml` | Fixed `publish = "dist"` (was `"dist"` but build output was `"build"`) | Netlify was deploying an empty folder |
| `netlify.toml` | Added SPA redirect `/* → /index.html` | React Router requires this |
| `netlify.toml` | Added security headers | Production best practice |
| `netlify.toml` | Added static asset caching headers | Faster repeat visits |
| `vite.config.js` | Changed `outDir: 'build'` → `outDir: 'dist'` | Match Netlify publish dir |
| `vite.config.js` | Added `manualChunks` for vendor splitting | Smaller chunks, faster loads |
| `.gitignore` | Added `build/` entry | Ignore old build output |
| `.env.example` | Added Netlify setup instructions | Developer guidance |

---

## 🌐 Step-by-Step Netlify Deployment

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub** → select your repo

3. **Build Settings** (auto-detected from `netlify.toml`)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

4. **Set Environment Variables** ← Critical step!

   Go to: **Site configuration → Environment variables → Add a variable**

   Add each variable below:

   | Key | Value |
   |-----|-------|
   | `VITE_FIREBASE_API_KEY` | Your Firebase API key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `phasetracker-b3bcf.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `phasetracker-b3bcf` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `phasetracker-b3bcf.firebasestorage.app` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
   | `VITE_FIREBASE_APP_ID` | Your app ID |
   | `VITE_CLOUDINARY_CLOUD_NAME` | `dqis32szu` |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | `daily_logs` |

   > ⚠️ Set scope to **"All scopes"** for each variable

5. **Click "Deploy site"** — Netlify will build and publish automatically

---

### Option B: Deploy via Netlify CLI

```bash
# 1. Install Netlify CLI (once)
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize site (first time)
netlify init

# 4. Deploy preview
netlify deploy --dir=dist

# 5. Deploy to production
netlify deploy --dir=dist --prod
```

---

## 🔒 Environment Variables — Security Notes

### Why `VITE_*` Prefix?
Vite **only exposes** environment variables prefixed with `VITE_` to the client bundle. This is intentional — other vars stay server-side only.

### Are Firebase Keys Safe in the Frontend?
**Yes** — Firebase API keys in the browser are **not secrets**. Security is enforced by:
- **Firebase Auth** — only authenticated users access data
- **Firestore Security Rules** — server-side access control
- **Authorized Domains** — only your Netlify domain can use the key

### Are Cloudinary Credentials Safe?
**Yes** — the project uses **unsigned upload presets**, which are designed for public browser-side uploads. No API secret is ever used or exposed.

### Never Commit `.env`
Your `.gitignore` already includes `.env` — ensure it stays that way!

---

## 🔥 Firebase: Authorize Your Netlify Domain

After deployment, add your Netlify domain to Firebase Auth:

1. [Firebase Console](https://console.firebase.google.com) → **Authentication**
2. Click **Settings** tab → **Authorized domains**
3. Click **Add domain**
4. Enter your Netlify URL (e.g., `your-site-name.netlify.app`)
5. If using a custom domain, add that too

> ❌ Without this, Firebase Auth will throw `auth/unauthorized-domain` errors!

---

## ⚡ Performance — Chunk Optimization Results

| Before | After |
|--------|-------|
| `index.js` — 719KB | `index.js` — 16KB |
| `ProjectDetail` — 462KB | `ProjectDetail` — 41KB |
| 1 large bundle | Separate vendor chunks (React, Firebase, PDF, Lottie) |

Vendor chunks are cached by browsers between deploys — users only re-download what actually changed.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| White screen after deploy | Check env vars are set correctly in Netlify dashboard |
| `auth/unauthorized-domain` | Add your `.netlify.app` domain to Firebase Auth → Authorized Domains |
| 404 on page refresh | Ensure `netlify.toml` redirect exists (`/* → /index.html`) |
| Images not uploading | Check Cloudinary upload preset is set to **Unsigned** |
| Build fails on Netlify | Ensure all `VITE_*` env variables are set before deploy |
| Old cached build | Click **"Clear cache and deploy site"** in Netlify dashboard |

---

## ✅ Pre-Deployment Checklist

- [ ] All `VITE_*` env variables added to Netlify dashboard
- [ ] Firebase Auth → Authorized Domains includes your Netlify URL
- [ ] `.env` is NOT committed to git
- [ ] `netlify.toml` is committed to git
- [ ] `dist/` is in `.gitignore`
- [ ] Cloudinary upload preset is set to **Unsigned**
- [ ] Local build works: `npm run build` succeeds

---

*Generated for ConstructaX — Construction Project Tracking System*
