# 🚀 Complete Deployment Guide - Hostinger hPanel
## Subdomain: https://nghc.nextgenproductlabs.com/

---

## 📋 Pre-Deployment Checklist

- [x] Subdomain created: `nghc.nextgenproductlabs.com`
- [x] FTP credentials available
- [ ] MongoDB connection string ready
- [ ] Gmail app password generated (if using email)
- [ ] Smarty Streets credentials (optional)

---

## 🔧 STEP 1: Prepare Local Build

### 1.1 Build the Frontend

```bash
# In your local project directory
npm install
npm run build
```

This creates a `dist/` folder with production-ready files.

### 1.2 Verify Build Output

Check that `dist/` folder contains:
- `index.html`
- `assets/` folder with JS and CSS files
- `favicon.ico`

---

## 📤 STEP 2: Upload Files via FTP

### 2.1 Connect via FTP

**FTP Details:**
- **Host:** `ftp://82.180.140.60`
- **Username:** `u475081356.nghc.nextgenproductlabs.com`
- **Password:** `996699@Admin`
- **Port:** `21`
- **Folder:** `public_html`

### 2.2 Upload Frontend Files

1. Connect to FTP using FileZilla or any FTP client
2. Navigate to `public_html/` folder
3. Upload **ALL contents** from your local `dist/` folder:
   - `index.html`
   - `assets/` folder (entire folder)
   - `favicon.ico`

### 2.3 Upload Backend Files

1. In FTP, navigate to `public_html/`
2. Create a folder named `api/` (if it doesn't exist)
3. Upload these files to `public_html/api/`:
   - `server.cjs`
   - `package.json`
   - `.env` (create this - see Step 3)
   - `server/` folder (entire folder with all services)

### 2.4 Upload Configuration Files

1. Upload `.htaccess` to `public_html/` root
2. Upload `test-api-connection.html` to `public_html/` (for testing)

---

## ⚙️ STEP 3: Create Environment File (.env)

### 3.1 Create .env File in hPanel

1. Login to **hPanel**
2. Go to **Files** → **File Manager**
3. Navigate to `public_html/api/`
4. Click **New File**
5. Name it: `.env`
6. Click **Edit** and paste the following:

```env
# ============================================
# Patient Registration System - Production
# Subdomain: nghc.nextgenproductlabs.com
# ============================================

# MongoDB Connection
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API (Optional - for address verification)
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR

# Email Configuration (Gmail)
# Use Gmail App Password: https://myaccount.google.com/apppasswords
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server Configuration
NODE_ENV=production
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=https://nghc.nextgenproductlabs.com
```

### 3.2 Update .env Values

**IMPORTANT:** Replace these values:
- `MONGODB_URI` - Your MongoDB connection string
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASSWORD` - Your Gmail app password (not regular password)

---

## 🎯 STEP 4: Configure Node.js in hPanel

### 4.1 Access Node.js Manager

1. Login to **hPanel**
2. Go to **Advanced** → **Node.js** (or **Node.js Manager**)

### 4.2 Create/Configure Node.js Application

**Critical Settings:**

| Setting | Value | Notes |
|---------|-------|-------|
| **Application Name** | `patient-registration-api` | Any name you prefer |
| **Application Root** | `/api` or `/public_html/api` | Where server.cjs is located |
| **Application URL** | `nghc.nextgenproductlabs.com/api` | **MUST include /api** |
| **Startup File** | `server.cjs` | Your Node.js entry point |
| **Port** | `3000` (or auto-assigned) | Check what port is assigned |
| **Node.js Version** | `18.x` or `20.x` | Latest LTS version |

### 4.3 Set Environment Variables in Node.js Manager

In Node.js Manager, add these environment variables:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=your-mongodb-connection-string
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://nghc.nextgenproductlabs.com
```

**Note:** You can set these in Node.js Manager OR in the `.env` file. Both work, but Node.js Manager takes precedence.

### 4.4 Install Dependencies

1. In Node.js Manager, find your application
2. Click **Terminal** or **SSH** access
3. Navigate to `/api` folder:
   ```bash
   cd /api
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

### 4.5 Start/Restart Node.js Application

1. In Node.js Manager, click **Start** or **Restart**
2. Status should show **Running** (green)
3. Click **View Logs** to verify:
   ```
   🚀 Server running on port 3000
   📡 API endpoints available at /api
   ```

---

## 🔍 STEP 5: Test API Connection

### 5.1 Test Health Endpoint

Open browser and visit:
```
https://nghc.nextgenproductlabs.com/api/health
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

**If you get JSON** → ✅ **API is working!**

**If you get 404 HTML** → See **Troubleshooting** section below.

### 5.2 Test Frontend

Visit:
```
https://nghc.nextgenproductlabs.com/
```

You should see the patient registration form.

### 5.3 Test API from Frontend

1. Open browser console (F12)
2. Go to **Network** tab
3. Try to verify an address in the form
4. Check if `/api/verify-address` returns JSON (not HTML)

---

## 🐛 STEP 6: Fix API 404 Error (If Needed)

### Problem: Getting "This Page Does Not Exist" HTML instead of JSON

### Solution 1: Verify Node.js Configuration

1. **Check Application URL:**
   - Must be: `nghc.nextgenproductlabs.com/api`
   - NOT: `nghc.nextgenproductlabs.com`

2. **Check Application Root:**
   - Must be: `/api` or `/public_html/api`
   - Must point to where `server.cjs` is located

3. **Check Status:**
   - Must be **Running** (green)

### Solution 2: Check File Structure

Verify files are in correct locations:

```
public_html/
├── index.html          ✅ Frontend
├── assets/            ✅ Frontend assets
├── .htaccess          ✅ Apache config
├── api/               ✅ Backend folder
│   ├── server.cjs     ✅ Main server file
│   ├── package.json   ✅ Dependencies
│   ├── .env           ✅ Environment variables
│   └── server/        ✅ Services folder
│       └── services/
```

### Solution 3: Verify .htaccess Configuration

Check that `.htaccess` in `public_html/` contains:

```apache
# Don't rewrite API calls
RewriteCond %{REQUEST_URI} !^/api
RewriteCond %{REQUEST_URI} !^/api/
```

### Solution 4: Check Node.js Logs

1. In Node.js Manager → **View Logs**
2. Look for errors:
   - Port conflicts
   - Missing dependencies
   - Environment variable errors
   - MongoDB connection errors

---

## ✅ STEP 7: Final Verification

### 7.1 Test All Endpoints

| Endpoint | Expected Result |
|----------|----------------|
| `https://nghc.nextgenproductlabs.com/` | Frontend loads |
| `https://nghc.nextgenproductlabs.com/api/health` | JSON response |
| `https://nghc.nextgenproductlabs.com/api/verify-address` | JSON response (POST) |
| `https://nghc.nextgenproductlabs.com/api/search-pharmacies/12345` | JSON response |

### 7.2 Test Complete Flow

1. ✅ Frontend loads
2. ✅ Can fill form
3. ✅ Address verification works
4. ✅ Pharmacy search works
5. ✅ Form submission works
6. ✅ Patient registration successful

---

## 📝 STEP 8: Update Code (Future Changes)

### 8.1 Make Changes Locally

1. Edit files in your local project
2. Test locally: `npm run dev`

### 8.2 Rebuild and Upload

```bash
# Rebuild
npm run build

# Upload new dist/ files via FTP
# Upload updated server files if backend changed
```

### 8.3 Restart Node.js

1. In Node.js Manager → **Restart**
2. Test changes

---

## 🔐 Security Checklist

- [ ] `.env` file is NOT in public_html root (only in `/api`)
- [ ] `.env` contains no sensitive data in git
- [ ] MongoDB connection string is secure
- [ ] Gmail app password is used (not regular password)
- [ ] `.htaccess` protects sensitive files

---

## 📞 Support Resources

### If API Still Returns 404:

1. **Check Node.js Manager:**
   - Application URL must include `/api`
   - Application must be Running
   - Check logs for errors

2. **Test Direct API:**
   - Visit `https://nghc.nextgenproductlabs.com/api/health`
   - Should return JSON, not HTML

3. **Contact Hostinger Support:**
   - Ask: "How do I configure Node.js to handle /api/* routes on my subdomain?"
   - Provide: Subdomain URL and Node.js application name

---

## 🎉 Success Indicators

✅ Frontend loads at: `https://nghc.nextgenproductlabs.com/`
✅ API health check works: `https://nghc.nextgenproductlabs.com/api/health`
✅ Address verification works
✅ Form submission works
✅ No 404 errors
✅ All API calls return JSON (not HTML)

---

## 📋 Quick Reference

**Subdomain:** `https://nghc.nextgenproductlabs.com/`
**API Base:** `https://nghc.nextgenproductlabs.com/api`
**FTP Folder:** `public_html/`
**Node.js Root:** `/api` or `/public_html/api`
**Startup File:** `server.cjs`
**Port:** `3000` (or auto-assigned)

---

**Last Updated:** Complete deployment guide for nghc.nextgenproductlabs.com

