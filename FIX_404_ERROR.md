# 🔧 Fix: "This Page Does Not Exist" 404 Error

## 📋 Issue Summary

When your React app tries to call API endpoints (like `/api/verify-address`), you get a 404 "This Page Does Not Exist" HTML page from Hostinger instead of JSON responses from your Node.js backend.

## 🔍 Root Cause

Apache (Hostinger's web server) receives requests to `/api/*` but doesn't know to forward them to your Node.js application. The Node.js app needs to be configured in Hostinger's Node.js Manager to handle these routes.

## ✅ Solution: Configure Node.js in hPanel

### Step 1: Access Node.js Manager
1. Login to **hPanel** (Hostinger control panel)
2. Go to **Advanced** → **Node.js** (or **Node.js Manager**)
3. Find your application

### Step 2: Configure Application Settings

**Critical Settings:**

| Setting | Value | Notes |
|---------|-------|-------|
| **Application Root** | `/api` or `/public_html/api` | Where your `server.cjs` file is located |
| **Application URL** | `yourdomain.com/api` | Must include `/api` path |
| **Startup File** | `server.cjs` | Your Node.js entry point |
| **Port** | `3000` (or auto-assigned) | Check what port is assigned |
| **Status** | **Running** | Must be green/running |

### Step 3: Verify Node.js is Running

1. Check the **Status** - should be "Running" (green)
2. Click **View Logs** - should see:
   ```
   🚀 Server running on port 3000
   📡 API endpoints available at /api
   ```

### Step 4: Test API Endpoint

Open your browser and visit:
```
https://yourdomain.com/api/health
```

**Expected Response (JSON):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "mongodb": "connected"
}
```

**If you get JSON** → ✅ **FIXED!** Your API is working.

**If you still get 404** → Continue to Alternative Solutions below.

---

## 🔄 Alternative Solution 1: Use Subdomain

If configuring `/api` path doesn't work, use a subdomain:

### Step 1: Create API Subdomain
1. hPanel → **Domains** → **Subdomains**
2. Create: `api.yourdomain.com`
3. Point to: `public_html/api`

### Step 2: Configure Node.js for Subdomain
- **Application URL:** `api.yourdomain.com`
- **Application Root:** `/api` or `/public_html/api`
- **Startup File:** `server.cjs`

### Step 3: Update Frontend Environment
1. Create/update `.env.production`:
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

2. Rebuild frontend:
   ```bash
   npm run build
   ```

3. Re-upload `dist/` folder to `public_html/`

---

## 🔄 Alternative Solution 2: Check File Structure

Ensure your files are in the correct location on Hostinger:

```
public_html/
├── index.html          (React build)
├── assets/            (React build assets)
├── .htaccess          (Apache config)
└── api/               (Node.js application)
    ├── server.cjs
    ├── package.json
    ├── .env
    └── server/
        └── services/
```

---

## 🔍 Diagnostic Checklist

Run through these checks:

- [ ] Node.js application status is "Running" in hPanel
- [ ] Application URL includes `/api` path
- [ ] Application Root points to where `server.cjs` is located
- [ ] `server.cjs` file exists and is correct
- [ ] `.env` file exists in Node.js app directory with all required variables
- [ ] Test `/api/health` returns JSON (not HTML)
- [ ] Check Node.js logs for errors
- [ ] MongoDB connection is working (if using database)

---

## 🆘 Still Not Working?

### Check Node.js Logs
1. hPanel → Node.js Manager → **View Logs**
2. Look for:
   - ✅ `Server running on port XXXX`
   - ❌ Any error messages
   - ❌ Port conflicts
   - ❌ Missing environment variables

### Test Direct API Call
Open browser console (F12) and run:
```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Contact Hostinger Support
If nothing works, contact Hostinger support and ask:
1. "How do I configure Node.js to handle `/api/*` routes?"
2. "Is reverse proxy (mod_proxy) enabled for my account?"
3. "Can you help configure my Node.js application to serve API endpoints?"

---

## ✅ Expected Behavior After Fix

- ✅ `/api/health` returns JSON
- ✅ `/api/verify-address` works
- ✅ `/api/search-pharmacies/:zipCode` works
- ✅ `/api/register-patient` works
- ✅ No more 404 HTML pages
- ✅ All API calls return JSON responses

---

## 📝 Quick Reference

**Test URL:** `https://yourdomain.com/api/health`

**Node.js Manager Location:** hPanel → Advanced → Node.js

**Required Settings:**
- Application URL: `yourdomain.com/api`
- Application Root: `/api` or `/public_html/api`
- Startup File: `server.cjs`
- Status: Running

---

**Last Updated:** Based on your current deployment setup

