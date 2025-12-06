# 📤 FTP Upload Guide - Complete Deployment
## nghc.nextgenproductlabs.com

---

## 🔧 FTP Connection Details

```
Host: ftp://82.180.140.60
Username: u475081356.nghc.nextgenproductlabs.com
Password: 996699@Admin
Port: 21
Root Folder: public_html/
```

---

## 📁 Files to Upload - Complete List

### ✅ FRONTEND FILES (Upload to: `public_html/`)

**From `dist/` folder:**
- ✅ `dist/index.html` → `public_html/index.html`
- ✅ `dist/favicon.ico` → `public_html/favicon.ico`
- ✅ `dist/assets/` (entire folder) → `public_html/assets/`

**From project root:**
- ✅ `.htaccess` → `public_html/.htaccess`
- ✅ `test-api-connection.html` → `public_html/test-api-connection.html`

---

### ✅ BACKEND FILES (Upload to: `public_html/api/`)

**From project root:**
- ✅ `server.cjs` → `public_html/api/server.cjs`
- ✅ `api-package.json` → `public_html/api/package.json` (rename after upload)

**From `server/` folder:**
- ✅ `server/services/` (entire folder) → `public_html/api/server/services/`
  - `pharmacyService.cjs`
  - `smartyService.cjs`
  - `uspsAddresses3Service.cjs`
  - `uspsService.cjs`

**Create new file:**
- ✅ `.env` → `public_html/api/.env` (create this file - see template below)

---

## 📝 Step-by-Step FTP Upload Instructions

### Step 1: Connect to FTP

1. Open FileZilla, WinSCP, or any FTP client
2. Enter connection details:
   - **Host:** `82.180.140.60`
   - **Username:** `u475081356.nghc.nextgenproductlabs.com`
   - **Password:** `996699@Admin`
   - **Port:** `21`
3. Click **Connect**

---

### Step 2: Upload Frontend Files

1. Navigate to `public_html/` on server
2. **Upload `index.html`:**
   - Local: `dist/index.html`
   - Remote: `public_html/index.html`
   - Drag and drop or right-click → Upload

3. **Upload `favicon.ico`:**
   - Local: `dist/favicon.ico`
   - Remote: `public_html/favicon.ico`

4. **Upload `assets/` folder:**
   - Local: `dist/assets/` (entire folder)
   - Remote: `public_html/assets/` (create folder if needed)
   - Upload entire folder with all contents

5. **Upload `.htaccess`:**
   - Local: `.htaccess` (project root)
   - Remote: `public_html/.htaccess`

6. **Upload `test-api-connection.html`:**
   - Local: `test-api-connection.html` (project root)
   - Remote: `public_html/test-api-connection.html`

---

### Step 3: Create API Folder

1. In FTP client, navigate to `public_html/`
2. Right-click → **Create Directory**
3. Name it: `api`
4. Double-click to enter `public_html/api/`

---

### Step 4: Upload Backend Files

1. **Upload `server.cjs`:**
   - Local: `server.cjs` (project root)
   - Remote: `public_html/api/server.cjs`

2. **Upload `package.json`:**
   - Local: `api-package.json` (project root)
   - Remote: `public_html/api/package.json`
   - **After upload, rename it to `package.json` if needed**

3. **Create `server/` folder:**
   - In `public_html/api/`, create folder: `server`
   - Inside `server/`, create folder: `services`

4. **Upload service files:**
   - Local: `server/services/pharmacyService.cjs`
   - Remote: `public_html/api/server/services/pharmacyService.cjs`
   
   - Local: `server/services/smartyService.cjs`
   - Remote: `public_html/api/server/services/smartyService.cjs`
   
   - Local: `server/services/uspsAddresses3Service.cjs`
   - Remote: `public_html/api/server/services/uspsAddresses3Service.cjs`
   
   - Local: `server/services/uspsService.cjs`
   - Remote: `public_html/api/server/services/uspsService.cjs`

---

### Step 5: Create .env File

1. In FTP client, navigate to `public_html/api/`
2. Right-click → **Create File**
3. Name it: `.env`
4. Right-click → **Edit**
5. Paste the content from `.env.template` (see below)
6. **Update with your actual values:**
   - MongoDB connection string
   - Gmail credentials (if using)
7. Save and close

---

## 📄 .env File Template

Create `public_html/api/.env` with this content:

```env
# ============================================
# Patient Registration System - Production
# Subdomain: nghc.nextgenproductlabs.com
# ============================================

# MongoDB Connection
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API - Address Verification
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

**⚠️ IMPORTANT:** Replace placeholder values with your actual credentials!

---

## ✅ Verification Checklist

After upload, verify these files exist:

### Frontend (`public_html/`):
- [ ] `index.html`
- [ ] `favicon.ico`
- [ ] `assets/index-210a054a.js`
- [ ] `assets/index-41e4e7e2.css`
- [ ] `.htaccess`
- [ ] `test-api-connection.html`

### Backend (`public_html/api/`):
- [ ] `server.cjs`
- [ ] `package.json`
- [ ] `.env`
- [ ] `server/services/pharmacyService.cjs`
- [ ] `server/services/smartyService.cjs`
- [ ] `server/services/uspsAddresses3Service.cjs`
- [ ] `server/services/uspsService.cjs`

---

## 🔍 File Structure After Upload

```
public_html/
├── index.html                    ✅
├── favicon.ico                   ✅
├── .htaccess                     ✅
├── test-api-connection.html      ✅
├── assets/                       ✅
│   ├── index-210a054a.js
│   └── index-41e4e7e2.css
└── api/                          ✅
    ├── server.cjs                ✅
    ├── package.json              ✅
    ├── .env                      ✅
    └── server/                    ✅
        └── services/              ✅
            ├── pharmacyService.cjs
            ├── smartyService.cjs
            ├── uspsAddresses3Service.cjs
            └── uspsService.cjs
```

---

## 🚀 Next Steps After FTP Upload

1. **Configure Node.js in hPanel:**
   - Go to hPanel → Advanced → Node.js
   - Create/Edit application
   - Set Application URL: `nghc.nextgenproductlabs.com/api`
   - Set Application Root: `/api` or `/public_html/api`
   - Set Startup File: `server.cjs`

2. **Install Dependencies:**
   - In Node.js Manager → Terminal
   - Run: `cd /api && npm install`

3. **Start Node.js:**
   - In Node.js Manager → Start/Restart
   - Check logs for: `🚀 Server running on port 3000`

4. **Test:**
   - Frontend: `https://nghc.nextgenproductlabs.com/`
   - API: `https://nghc.nextgenproductlabs.com/api/health`

---

## 🐛 Troubleshooting

### Files Not Uploading:
- Check FTP connection
- Verify folder permissions
- Try uploading one file at a time

### Files in Wrong Location:
- Verify you're in correct folder (`public_html/` or `public_html/api/`)
- Check file paths match the structure above

### .env File Not Saving:
- Make sure file name is exactly `.env` (with dot)
- Some FTP clients require creating file first, then editing

---

## 📞 Need Help?

If you encounter issues:
1. Verify all files are uploaded correctly
2. Check file permissions (should be 644 for files, 755 for folders)
3. Verify `.env` file has correct values
4. Check Node.js configuration in hPanel

---

**Total Upload Time:** ~5-10 minutes depending on connection speed

