# 🚀 FTP UPLOAD - START HERE
## All Files Ready for Upload

---

## ⚡ Quick Start

**I've prepared all files. Now you need to upload them via FTP.**

---

## 📤 FTP Connection

```
Host: 82.180.140.60
Username: u475081356.nghc.nextgenproductlabs.com
Password: 996699@Admin
Port: 21
```

**Use:** FileZilla, WinSCP, or any FTP client

---

## 📁 What to Upload

### 1. Frontend Files → `public_html/`

Upload these files from your local `dist/` folder:
- ✅ `dist/index.html` → `public_html/index.html`
- ✅ `dist/favicon.ico` → `public_html/favicon.ico`
- ✅ `dist/assets/` (entire folder) → `public_html/assets/`

Upload from project root:
- ✅ `.htaccess` → `public_html/.htaccess`
- ✅ `test-api-connection.html` → `public_html/test-api-connection.html`

### 2. Backend Files → `public_html/api/`

**First, create `api/` folder in `public_html/`**

Then upload:
- ✅ `server.cjs` → `public_html/api/server.cjs`
- ✅ `api-package.json` → `public_html/api/package.json` (rename to `package.json` after upload)

**Create folder:** `public_html/api/server/services/`

Then upload:
- ✅ `server/services/pharmacyService.cjs` → `public_html/api/server/services/pharmacyService.cjs`
- ✅ `server/services/smartyService.cjs` → `public_html/api/server/services/smartyService.cjs`
- ✅ `server/services/uspsAddresses3Service.cjs` → `public_html/api/server/services/uspsAddresses3Service.cjs`
- ✅ `server/services/uspsService.cjs` → `public_html/api/server/services/uspsService.cjs`

### 3. Create .env File

**In `public_html/api/`, create file `.env`**

Copy this content (update with your values):

```env
# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# Smarty Streets API - Address Verification (CONFIGURED)
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
SMARTY_EMBEDDED_KEY=254574191005277116

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://nghc.nextgenproductlabs.com
```

---

## 📋 Step-by-Step Upload

### Step 1: Connect to FTP
1. Open FileZilla or WinSCP
2. Enter connection details above
3. Click Connect

### Step 2: Upload Frontend
1. Navigate to `public_html/` on server
2. Upload all files from `dist/` folder
3. Upload `.htaccess` and `test-api-connection.html`

### Step 3: Create API Folder
1. In `public_html/`, create folder `api`
2. Enter `api/` folder

### Step 4: Upload Backend
1. Upload `server.cjs` and `api-package.json`
2. Create `server/services/` folder
3. Upload all service files

### Step 5: Create .env
1. Create `.env` file in `public_html/api/`
2. Paste content from above
3. Update with your MongoDB and email credentials

---

## ✅ After Upload - Configure Node.js

1. **hPanel → Advanced → Node.js**
2. **Create/Edit Application:**
   - Application URL: `nghc.nextgenproductlabs.com/api` ⚠️ **MUST include /api**
   - Application Root: `/api` or `/public_html/api`
   - Startup File: `server.cjs`
3. **Terminal:** `cd /api && npm install`
4. **Start** the application

---

## 🔍 Detailed Guides

- **Complete Upload Guide:** `FTP_UPLOAD_GUIDE.md`
- **Checklist:** `FTP_UPLOAD_CHECKLIST.txt`
- **Full Deployment:** `COMPLETE_DEPLOYMENT_GUIDE.md`

---

## ⚠️ IMPORTANT

**Node.js Application URL MUST be:** `nghc.nextgenproductlabs.com/api`

If you set it to `nghc.nextgenproductlabs.com` (without `/api`), you'll get 404 errors!

---

**Ready? Start uploading!**

