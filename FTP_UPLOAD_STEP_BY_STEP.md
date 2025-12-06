# 📤 FTP Upload - Step-by-Step Instructions
## Upload All Files to Hostinger hPanel

---

## 🔧 FTP Connection Details

```
Host: 82.180.140.60
Username: u475081356.nghc.nextgenproductlabs.com
Password: 996699@Admin
Port: 21
Root Folder: public_html/
```

---

## 📋 STEP 1: Connect to FTP

### Using FileZilla (Recommended)

1. **Download FileZilla** (if not installed): https://filezilla-project.org/
2. **Open FileZilla**
3. **Enter connection details:**
   - **Host:** `82.180.140.60`
   - **Username:** `u475081356.nghc.nextgenproductlabs.com`
   - **Password:** `996699@Admin`
   - **Port:** `21`
4. **Click "Quickconnect"**

### Using WinSCP (Alternative)

1. **Download WinSCP** (if not installed): https://winscp.net/
2. **Open WinSCP**
3. **Enter connection details** (same as above)
4. **Click "Login"**

---

## 📁 STEP 2: Upload Frontend Files

### Navigate to Server
1. On the **right side** (Remote site), navigate to `public_html/`
2. If `public_html/` doesn't exist, create it

### Upload Files from `dist/` folder

**On the left side** (Local site), navigate to your project's `dist/` folder:

1. **Upload `index.html`:**
   - Find `dist/index.html` on left
   - Drag to `public_html/` on right
   - OR: Right-click → Upload

2. **Upload `favicon.ico`:**
   - Find `dist/favicon.ico` on left
   - Drag to `public_html/` on right

3. **Upload `assets/` folder:**
   - Find `dist/assets/` folder on left
   - Drag entire folder to `public_html/` on right
   - Make sure the folder structure is: `public_html/assets/`

### Upload Configuration Files

**From project root** (left side):

1. **Upload `.htaccess`:**
   - Find `.htaccess` in project root
   - Drag to `public_html/` on right

2. **Upload `test-api-connection.html`:**
   - Find `test-api-connection.html` in project root
   - Drag to `public_html/` on right

---

## 📁 STEP 3: Create API Folder and Upload Backend

### Create API Folder
1. On **right side**, in `public_html/`, right-click
2. Select **Create Directory**
3. Name it: `api`
4. Double-click to enter `public_html/api/`

### Upload Backend Files

**From project root** (left side):

1. **Upload `server.cjs`:**
   - Find `server.cjs` in project root
   - Drag to `public_html/api/` on right

2. **Upload `api-package.json`:**
   - Find `api-package.json` in project root
   - Drag to `public_html/api/` on right
   - **After upload, rename it to `package.json`** (right-click → Rename)

### Create Server/Services Folder Structure

1. In `public_html/api/`, create folder: `server`
2. In `public_html/api/server/`, create folder: `services`

### Upload Service Files

**From `server/services/` folder** (left side):

1. **Upload `pharmacyService.cjs`:**
   - Find `server/services/pharmacyService.cjs`
   - Drag to `public_html/api/server/services/`

2. **Upload `smartyService.cjs`:**
   - Find `server/services/smartyService.cjs`
   - Drag to `public_html/api/server/services/`

3. **Upload `uspsAddresses3Service.cjs`:**
   - Find `server/services/uspsAddresses3Service.cjs`
   - Drag to `public_html/api/server/services/`

4. **Upload `uspsService.cjs`:**
   - Find `server/services/uspsService.cjs`
   - Drag to `public_html/api/server/services/`

---

## 📝 STEP 4: Create .env File

### Option 1: Using FileZilla

1. Navigate to `public_html/api/` on right side
2. Right-click in empty space
3. Select **Create file**
4. Name it: `.env` (with the dot at the beginning)
5. Right-click on `.env` → **View/Edit**
6. Copy content from `ENV_FILE_PRODUCTION.txt` (see below)
7. Paste and save

### Option 2: Using hPanel File Manager

1. Login to **hPanel**
2. Go to **Files** → **File Manager**
3. Navigate to `public_html/api/`
4. Click **New File**
5. Name it: `.env`
6. Click **Edit**
7. Paste content (see below)
8. **Update MongoDB URI** (replace placeholder)
9. Click **Save**

### .env File Content

Copy this entire content:

```env
# ============================================
# Patient Registration System - Production
# Subdomain: nghc.nextgenproductlabs.com
# ============================================

# MongoDB Connection
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API - Address Verification (CONFIGURED)
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
SMARTY_EMBEDDED_KEY=254574191005277116

# Email Configuration (Gmail) - CONFIGURED
EMAIL_USER=asifkhanpathan899@gmail.com
EMAIL_PASSWORD=Asif@090itj

# Server Configuration
NODE_ENV=production
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=https://nghc.nextgenproductlabs.com
```

**⚠️ IMPORTANT:** Replace `MONGODB_URI` with your actual MongoDB connection string!

---

## ✅ STEP 5: Verify Upload

### Check Frontend Files (`public_html/`)

Verify these files exist:
- [ ] `index.html`
- [ ] `favicon.ico`
- [ ] `assets/index-210a054a.js`
- [ ] `assets/index-41e4e7e2.css`
- [ ] `.htaccess`
- [ ] `test-api-connection.html`

### Check Backend Files (`public_html/api/`)

Verify these files exist:
- [ ] `server.cjs`
- [ ] `package.json` (renamed from `api-package.json`)
- [ ] `.env`
- [ ] `server/services/pharmacyService.cjs`
- [ ] `server/services/smartyService.cjs`
- [ ] `server/services/uspsAddresses3Service.cjs`
- [ ] `server/services/uspsService.cjs`

---

## 📁 Final File Structure

After upload, your server should have:

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
    └── server/                   ✅
        └── services/             ✅
            ├── pharmacyService.cjs
            ├── smartyService.cjs
            ├── uspsAddresses3Service.cjs
            └── uspsService.cjs
```

---

## 🚀 STEP 6: After Upload - Configure Node.js

1. **Login to hPanel**
2. **Go to:** Advanced → Node.js
3. **Create/Edit Application:**
   - Application Root: `/api` or `/public_html/api`
   - Application URL: `nghc.nextgenproductlabs.com/api` ⚠️ **MUST include /api**
   - Startup File: `server.cjs`
   - Port: `3000`
4. **Terminal:** `cd /api && npm install`
5. **Start** the application

---

## 🔍 STEP 7: Test Deployment

1. **Frontend:** `https://nghc.nextgenproductlabs.com/`
2. **API Health:** `https://nghc.nextgenproductlabs.com/api/health`
3. **Test Page:** `https://nghc.nextgenproductlabs.com/test-api-connection.html`

---

## 🐛 Troubleshooting

### Files Not Uploading
- Check FTP connection
- Verify folder permissions
- Try uploading one file at a time

### .env File Not Saving
- Make sure file name is exactly `.env` (with dot)
- Some FTP clients require creating file first, then editing

### Wrong File Locations
- Verify you're in correct folder (`public_html/` or `public_html/api/`)
- Check file paths match the structure above

---

## ⏱️ Estimated Time

- **FTP Upload:** 5-10 minutes
- **Create .env:** 2 minutes
- **Configure Node.js:** 3 minutes
- **Total:** ~15 minutes

---

**Ready to upload? Follow the steps above!**

