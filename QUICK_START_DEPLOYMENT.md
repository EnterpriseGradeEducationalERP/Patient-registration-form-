# ⚡ Quick Start Deployment Guide
## nghc.nextgenproductlabs.com

---

## 🎯 5-Minute Deployment

### Step 1: Build Locally (2 minutes)

```bash
# In your project folder
npm install
npm run build
```

This creates `dist/` folder with production files.

---

### Step 2: Upload via FTP (2 minutes)

**FTP Connection:**
- Host: `ftp://82.180.140.60`
- User: `u475081356.nghc.nextgenproductlabs.com`
- Pass: `996699@Admin`
- Port: `21`

**Upload to `public_html/`:**
- `dist/index.html`
- `dist/assets/` (entire folder)
- `dist/favicon.ico`
- `.htaccess`

**Upload to `public_html/api/`:**
- `server.cjs`
- `package.json` (use `api-package.json` from repo)
- `server/` folder (entire folder)

---

### Step 3: Create .env File (1 minute)

In hPanel → File Manager → `public_html/api/` → Create `.env`:

```env
MONGODB_URI=your-mongodb-connection-string
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://nghc.nextgenproductlabs.com
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

---

### Step 4: Configure Node.js in hPanel (2 minutes)

1. hPanel → **Advanced** → **Node.js**
2. Create/Edit Application:
   - **Application Root:** `/api` or `/public_html/api`
   - **Application URL:** `nghc.nextgenproductlabs.com/api` ⚠️ **MUST include /api**
   - **Startup File:** `server.cjs`
   - **Port:** `3000`
3. Click **Terminal** → `cd /api` → `npm install`
4. Click **Start**

---

### Step 5: Test (1 minute)

✅ Frontend: `https://nghc.nextgenproductlabs.com/`
✅ API: `https://nghc.nextgenproductlabs.com/api/health`

---

## 🐛 If API Returns 404:

**Fix:** In Node.js Manager, set **Application URL** to: `nghc.nextgenproductlabs.com/api` (must include `/api`)

---

## 📚 Full Guide

See `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

**Total Time:** ~8 minutes

