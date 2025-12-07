# 🔧 Fix: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
## Complete Step-by-Step Solution

---

## 📋 Issue Confirmed

**Error:** `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**This means:** Your API is returning HTML (404 page) instead of JSON.

**Root Cause:** Node.js Application URL in hPanel is **NOT configured correctly**.

---

## ✅ SOLUTION: Fix Node.js Configuration (REQUIRED)

### Step 1: Login to hPanel

1. Go to: https://hpanel.hostinger.com
2. Login with your credentials

### Step 2: Access Node.js Manager

1. Click **Advanced** (left menu)
2. Click **Node.js** or **Node.js Manager**
3. Find your application (should show "Build failed" or "Stopped")

### Step 3: Check Current Settings

**Look at these settings:**
- Application URL: What does it say?
- Application Root: What does it say?
- Status: Is it Running or Stopped?

### Step 4: Fix Application URL (CRITICAL!)

**⚠️ THIS IS THE MOST IMPORTANT STEP!**

1. **Click "Edit"** or **"Settings"** on your Node.js application
2. **Find "Application URL" field**
3. **Change it to:** `nghc.nextgenproductlabs.com/api`
   - ✅ **Correct:** `nghc.nextgenproductlabs.com/api`
   - ❌ **Wrong:** `nghc.nextgenproductlabs.com` (missing /api)
   - ❌ **Wrong:** `https://nghc.nextgenproductlabs.com/api` (don't include https://)
4. **Verify other settings:**
   - **Application Root:** `/api` or `/public_html/api`
   - **Startup File:** `server.cjs`
   - **Node.js Version:** `20.x` (change from 18.x to 20.x)
5. **Click "Save"**

### Step 5: Change Node.js Version to 20.x

**The build warnings show you need Node.js 20.x:**

1. In Node.js Manager, find **"Node.js Version"** dropdown
2. **Change from:** `18.x`
3. **Change to:** `20.x`
4. **Save** the changes

### Step 6: Restart Application

1. **Click "Restart"** or **"Start"** button
2. **Wait for status to show "Running"** (green)
3. **Click "View Logs"**
4. **Should see:**
   ```
   🚀 Server running on port 3000
   📡 API endpoints available at /api
   ✅ Smarty Streets API configured
   ```

---

## 🔍 Step 7: Test API (VERIFY FIX)

### Test 1: Direct Browser Test

Open browser and visit:
```
https://nghc.nextgenproductlabs.com/api/health
```

**✅ Expected (JSON):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "mongodb": "connected"
}
```

**❌ If you still get HTML 404 page:**
- Application URL is still wrong
- Go back to Step 4
- Make sure it's exactly: `nghc.nextgenproductlabs.com/api` (no https://, no trailing slash)

### Test 2: Browser Console Test

Open browser console (F12) and run:
```javascript
fetch('https://nghc.nextgenproductlabs.com/api/health')
  .then(r => r.text())
  .then(text => {
    console.log('Response:', text.substring(0, 100));
    if (text.startsWith('<!DOCTYPE')) {
      console.error('❌ STILL GETTING HTML! Check Node.js Application URL.');
    } else {
      try {
        const json = JSON.parse(text);
        console.log('✅ SUCCESS! Got JSON:', json);
      } catch (e) {
        console.error('❌ Not valid JSON:', e);
      }
    }
  })
  .catch(console.error)
```

---

## 🐛 Common Mistakes

### Mistake 1: Application URL Missing /api

**Wrong:**
- `nghc.nextgenproductlabs.com`
- `https://nghc.nextgenproductlabs.com`
- `nghc.nextgenproductlabs.com/`

**Correct:**
- `nghc.nextgenproductlabs.com/api`

### Mistake 2: Wrong Application Root

**Wrong:**
- `/`
- `/public_html/`

**Correct:**
- `/api` or `/public_html/api`

### Mistake 3: Wrong Startup File

**Wrong:**
- `server.js`
- `index.js`

**Correct:**
- `server.cjs`

### Mistake 4: Node.js Version Too Old

**Wrong:**
- `18.x` (causes build warnings)

**Correct:**
- `20.x` (fixes build warnings)

---

## ✅ Verification Checklist

After fixing, check:

- [ ] Application URL = `nghc.nextgenproductlabs.com/api`
- [ ] Application Root = `/api` or `/public_html/api`
- [ ] Startup File = `server.cjs`
- [ ] Node.js Version = `20.x`
- [ ] Status = **Running** (green)
- [ ] `https://nghc.nextgenproductlabs.com/api/health` returns JSON
- [ ] No more "Unexpected token '<'" errors

---

## 📝 Screenshot Checklist

When configuring in hPanel, your settings should look like:

```
Application Name: patient-registration-api
Application URL: nghc.nextgenproductlabs.com/api
Application Root: /api
Startup File: server.cjs
Node.js Version: 20.x
Port: 3000 (or auto-assigned)
Status: Running
```

---

## 🆘 Still Not Working?

### Check 1: Verify Files Exist

1. In hPanel File Manager, go to `public_html/api/`
2. Verify these files exist:
   - `server.cjs` ✅
   - `package.json` ✅
   - `.env` ✅
   - `server/services/` folder ✅

### Check 2: Check Node.js Logs

1. Node.js Manager → **View Logs**
2. Look for errors:
   - ❌ "Cannot find module"
   - ❌ "Port already in use"
   - ❌ "EADDRINUSE"

### Check 3: Test Direct API Call

1. Open browser
2. Visit: `https://nghc.nextgenproductlabs.com/api/health`
3. If you see HTML → Node.js not configured
4. If you see JSON → Node.js is working!

### Check 4: Contact Hostinger Support

If nothing works, contact support with:
- Subdomain: `nghc.nextgenproductlabs.com`
- Issue: API endpoints return HTML 404 instead of JSON
- Request: Help configuring Node.js Application URL to handle `/api/*` routes

---

## 🎯 Quick Fix Summary

**The fix in 3 steps:**

1. **hPanel → Node.js → Edit**
2. **Set Application URL:** `nghc.nextgenproductlabs.com/api`
3. **Set Node.js Version:** `20.x`
4. **Save & Restart**

**That's it!** This fixes 95% of cases.

---

## ✅ Expected After Fix

- ✅ `https://nghc.nextgenproductlabs.com/api/health` returns JSON
- ✅ No more "Unexpected token '<'" errors
- ✅ Address verification works
- ✅ All API endpoints work
- ✅ Frontend can communicate with backend

---

**The issue is Node.js configuration, not your code!**

