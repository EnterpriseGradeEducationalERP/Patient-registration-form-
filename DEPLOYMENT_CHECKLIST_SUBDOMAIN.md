# ✅ Deployment Checklist - nghc.nextgenproductlabs.com

## 📋 Pre-Deployment

- [ ] MongoDB connection string ready
- [ ] Gmail app password generated (if using email)
- [ ] Local project builds successfully (`npm run build`)
- [ ] FTP client installed (FileZilla, WinSCP, etc.)

---

## 📤 Step 1: Upload Files via FTP

### Frontend Files (to public_html/)

- [ ] Connect to FTP: `ftp://82.180.140.60`
- [ ] Username: `u475081356.nghc.nextgenproductlabs.com`
- [ ] Password: `996699@Admin`
- [ ] Navigate to `public_html/`
- [ ] Upload `dist/index.html`
- [ ] Upload `dist/assets/` folder (entire folder)
- [ ] Upload `dist/favicon.ico`
- [ ] Upload `.htaccess` to root
- [ ] Upload `test-api-connection.html` (for testing)

### Backend Files (to public_html/api/)

- [ ] Create `api/` folder in `public_html/` (if doesn't exist)
- [ ] Upload `server.cjs` to `public_html/api/`
- [ ] Upload `package.json` to `public_html/api/`
- [ ] Upload `server/` folder (entire folder) to `public_html/api/`
- [ ] Create `.env` file in `public_html/api/` (see Step 2)

---

## ⚙️ Step 2: Configure Environment

- [ ] Create `.env` file in `public_html/api/`
- [ ] Add MongoDB connection string
- [ ] Add Smarty Streets credentials (if using)
- [ ] Add Gmail credentials (if using email)
- [ ] Set `FRONTEND_URL=https://nghc.nextgenproductlabs.com`
- [ ] Set `NODE_ENV=production`
- [ ] Set `PORT=3000`

---

## 🎯 Step 3: Configure Node.js in hPanel

- [ ] Login to hPanel
- [ ] Go to **Advanced** → **Node.js**
- [ ] Create new application OR edit existing
- [ ] Set **Application Name**: `patient-registration-api`
- [ ] Set **Application Root**: `/api` or `/public_html/api`
- [ ] Set **Application URL**: `nghc.nextgenproductlabs.com/api` ⚠️ **MUST include /api**
- [ ] Set **Startup File**: `server.cjs`
- [ ] Set **Port**: `3000` (or auto-assigned)
- [ ] Set **Node.js Version**: `18.x` or `20.x`
- [ ] Add environment variables (or use .env file)
- [ ] Click **Save**

---

## 📦 Step 4: Install Dependencies

- [ ] In Node.js Manager, open **Terminal** or **SSH**
- [ ] Navigate to `/api` folder: `cd /api`
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Verify `node_modules/` folder created

---

## 🚀 Step 5: Start Node.js Application

- [ ] In Node.js Manager, click **Start** or **Restart**
- [ ] Status should show **Running** (green)
- [ ] Click **View Logs**
- [ ] Verify logs show: `🚀 Server running on port 3000`
- [ ] Verify logs show: `📡 API endpoints available at /api`

---

## 🔍 Step 6: Test Deployment

### Test Frontend
- [ ] Visit: `https://nghc.nextgenproductlabs.com/`
- [ ] Frontend loads correctly
- [ ] No console errors (F12 → Console)

### Test API Health
- [ ] Visit: `https://nghc.nextgenproductlabs.com/api/health`
- [ ] Returns JSON (not HTML)
- [ ] JSON contains: `{"status":"ok",...}`

### Test API from Frontend
- [ ] Open browser console (F12)
- [ ] Go to **Network** tab
- [ ] Try address verification in form
- [ ] Check `/api/verify-address` request
- [ ] Response is JSON (not HTML 404)

### Test Complete Flow
- [ ] Fill out patient registration form
- [ ] Address verification works
- [ ] Pharmacy search works
- [ ] Form submission works
- [ ] Patient registration successful

---

## 🐛 Step 7: Troubleshooting (If Needed)

### If API Returns 404 HTML:

- [ ] Check Node.js Application URL includes `/api`
- [ ] Check Application Root points to `/api` folder
- [ ] Check Node.js application is **Running**
- [ ] Check Node.js logs for errors
- [ ] Verify `server.cjs` exists in `/api` folder
- [ ] Verify `.env` file exists in `/api` folder
- [ ] Test direct API: `https://nghc.nextgenproductlabs.com/api/health`

### If Frontend Doesn't Load:

- [ ] Verify `index.html` in `public_html/` root
- [ ] Verify `assets/` folder in `public_html/`
- [ ] Check browser console for errors
- [ ] Verify `.htaccess` file exists

### If MongoDB Connection Fails:

- [ ] Verify MongoDB connection string in `.env`
- [ ] Check MongoDB is accessible from Hostinger
- [ ] Verify MongoDB credentials are correct
- [ ] Check Node.js logs for MongoDB errors

---

## ✅ Final Verification

- [ ] ✅ Frontend: `https://nghc.nextgenproductlabs.com/` loads
- [ ] ✅ API Health: `https://nghc.nextgenproductlabs.com/api/health` returns JSON
- [ ] ✅ Address Verification works
- [ ] ✅ Pharmacy Search works
- [ ] ✅ Form Submission works
- [ ] ✅ No 404 errors
- [ ] ✅ All API calls return JSON (not HTML)

---

## 📝 Quick Reference

**Subdomain:** `https://nghc.nextgenproductlabs.com/`
**API Base:** `https://nghc.nextgenproductlabs.com/api`
**FTP Host:** `ftp://82.180.140.60`
**FTP User:** `u475081356.nghc.nextgenproductlabs.com`
**FTP Folder:** `public_html/`
**Node.js Root:** `/api` or `/public_html/api`
**Startup File:** `server.cjs`

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

