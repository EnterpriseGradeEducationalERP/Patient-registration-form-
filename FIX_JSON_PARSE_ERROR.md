# 🔧 Fix: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

## 📋 Issue Description

**Error:** `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**What's happening:**
- Your frontend is calling an API endpoint (like `/api/verify-address`)
- Instead of getting JSON response, it's receiving an HTML page (404 error page)
- Frontend tries to parse HTML as JSON → Error!

**Root Cause:** API requests are not reaching Node.js. Apache is returning HTML 404 page instead.

---

## ✅ Solution: Fix Node.js Configuration

### Step 1: Check Node.js Application in hPanel

1. **Login to hPanel**
2. **Go to:** Advanced → Node.js (or Node.js Manager)
3. **Find your application**

### Step 2: Verify Critical Settings

**Check these settings:**

| Setting | Must Be | Current Value |
|---------|---------|---------------|
| **Application URL** | `nghc.nextgenproductlabs.com/api` ⚠️ | ? |
| **Application Root** | `/api` or `/public_html/api` | ? |
| **Startup File** | `server.cjs` | ? |
| **Status** | **Running** (green) | ? |

**⚠️ CRITICAL:** Application URL **MUST** include `/api` at the end!

### Step 3: Fix Application URL

**If Application URL is wrong:**

1. **Click Edit** on your Node.js application
2. **Set Application URL to:** `nghc.nextgenproductlabs.com/api`
   - NOT: `nghc.nextgenproductlabs.com` (without /api)
   - NOT: `https://nghc.nextgenproductlabs.com/api` (no https://)
3. **Save** the changes
4. **Restart** the application

### Step 4: Verify Node.js is Running

1. **Check Status** - Should be "Running" (green)
2. **Click View Logs**
3. **Should see:**
   ```
   🚀 Server running on port 3000
   📡 API endpoints available at /api
   ✅ Smarty Streets API configured
   ```

---

## 🔍 Step 5: Test API Directly

### Test 1: API Health Endpoint

Open browser and visit:
```
https://nghc.nextgenproductlabs.com/api/health
```

**Expected (JSON):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "mongodb": "connected"
}
```

**If you get HTML 404 page** → Node.js is not configured correctly
**If you get JSON** → Node.js is working! Continue to Step 6.

### Test 2: Address Verification Endpoint

Open browser console (F12) and run:
```javascript
fetch('https://nghc.nextgenproductlabs.com/api/verify-address', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    address1: '1600 Pennsylvania Ave NW',
    city: 'Washington',
    state: 'DC',
    zip5: '20500'
  })
})
.then(r => r.text())
.then(console.log)
.catch(console.error)
```

**Expected:** JSON response
**If HTML:** Node.js routing issue

---

## 🐛 Common Issues & Fixes

### Issue 1: Application URL Missing /api

**Symptom:** Getting HTML 404 page for all API calls

**Fix:**
- Set Application URL to: `nghc.nextgenproductlabs.com/api`
- Restart Node.js application

### Issue 2: Application Not Running

**Symptom:** Status shows "Stopped" or "Error"

**Fix:**
1. Check Node.js logs for errors
2. Verify `server.cjs` exists in `/api` folder
3. Verify `.env` file exists
4. Click **Start** or **Restart**

### Issue 3: Wrong Application Root

**Symptom:** Node.js can't find `server.cjs`

**Fix:**
- Set Application Root to: `/api` or `/public_html/api`
- Verify `server.cjs` is in that location

### Issue 4: Port Conflict

**Symptom:** Node.js fails to start

**Fix:**
- Check what port is assigned
- Update `.env` file with correct PORT
- Restart application

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] Node.js Application URL = `nghc.nextgenproductlabs.com/api`
- [ ] Node.js Application Root = `/api` or `/public_html/api`
- [ ] Node.js Status = **Running** (green)
- [ ] `https://nghc.nextgenproductlabs.com/api/health` returns JSON
- [ ] Browser console shows no JSON parse errors
- [ ] Address verification works in frontend

---

## 🔧 Quick Fix Summary

**Most Common Fix (90% of cases):**

1. **hPanel → Node.js Manager**
2. **Edit Application**
3. **Set Application URL:** `nghc.nextgenproductlabs.com/api` ⚠️
4. **Save & Restart**
5. **Test:** `https://nghc.nextgenproductlabs.com/api/health`

---

## 📝 Test After Fix

1. **Open:** `https://nghc.nextgenproductlabs.com/`
2. **Open Browser Console** (F12)
3. **Try address verification** in the form
4. **Check Network tab:**
   - Request to `/api/verify-address`
   - Response should be JSON (not HTML)
   - Status should be 200 (not 404)

---

## 🆘 Still Not Working?

### Check Browser Console

1. Open browser console (F12)
2. Go to **Network** tab
3. Try address verification
4. Click on the `/api/verify-address` request
5. Check:
   - **Status:** Should be 200 (not 404)
   - **Response:** Should be JSON (not HTML)
   - **URL:** Should be `https://nghc.nextgenproductlabs.com/api/verify-address`

### Check Node.js Logs

1. hPanel → Node.js Manager → **View Logs**
2. Look for:
   - ✅ `Server running on port 3000`
   - ✅ `API endpoints available at /api`
   - ❌ Any error messages

### Contact Hostinger Support

If nothing works, contact Hostinger support with:
- Subdomain: `nghc.nextgenproductlabs.com`
- Issue: API endpoints return HTML 404 instead of JSON
- Request: Help configuring Node.js to handle `/api/*` routes

---

## ✅ Expected Behavior After Fix

- ✅ API calls return JSON (not HTML)
- ✅ No "Unexpected token '<'" errors
- ✅ Address verification works
- ✅ All API endpoints accessible
- ✅ Frontend can parse responses correctly

---

**The fix is almost always: Set Application URL to include `/api`!**

