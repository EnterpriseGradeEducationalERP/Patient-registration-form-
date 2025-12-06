# 🔧 Complete Fix: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

## 📋 Error Explanation

**Error:** `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**What's Happening:**
1. Your frontend calls `/api/verify-address` (or other API endpoints)
2. Instead of getting JSON from Node.js, Apache returns an HTML 404 page
3. Frontend tries to parse HTML as JSON → **Error!**

**Root Cause:** Node.js Application URL in hPanel is **NOT configured correctly**. Apache doesn't know to forward `/api/*` requests to Node.js.

---

## ✅ SOLUTION: Fix Node.js Configuration in hPanel

### Step 1: Login to hPanel

1. Go to: https://hpanel.hostinger.com
2. Login with your credentials

### Step 2: Access Node.js Manager

1. Click **Advanced** (in left menu)
2. Click **Node.js** (or **Node.js Manager**)
3. Find your application (or create new one)

### Step 3: Configure Application Settings

**⚠️ CRITICAL SETTINGS:**

| Setting | Must Be | Current Value? |
|---------|----------|----------------|
| **Application URL** | `nghc.nextgenproductlabs.com/api` ⚠️ | ❓ |
| **Application Root** | `/api` or `/public_html/api` | ❓ |
| **Startup File** | `server.cjs` | ❓ |
| **Port** | `3000` (or auto-assigned) | ❓ |
| **Status** | **Running** (green) | ❓ |

### Step 4: Fix Application URL

**This is the MOST IMPORTANT step!**

1. **Click Edit** on your Node.js application
2. **Find "Application URL" field**
3. **Set it to:** `nghc.nextgenproductlabs.com/api`
   - ✅ **Correct:** `nghc.nextgenproductlabs.com/api`
   - ❌ **Wrong:** `nghc.nextgenproductlabs.com` (missing /api)
   - ❌ **Wrong:** `https://nghc.nextgenproductlabs.com/api` (don't include https://)
4. **Click Save**
5. **Click Restart** (or Start if stopped)

### Step 5: Verify Application is Running

1. **Check Status** - Should show **Running** (green dot)
2. **Click "View Logs"**
3. **Should see:**
   ```
   🚀 Server running on port 3000
   📡 API endpoints available at /api
   ✅ Smarty Streets API configured
   ```

---

## 🔍 Step 6: Test API Directly

### Test 1: Health Endpoint

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

**❌ If you get HTML 404 page:**
- Node.js Application URL is still wrong
- Go back to Step 4 and verify it's exactly: `nghc.nextgenproductlabs.com/api`

### Test 2: Address Verification

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
.then(text => {
  if (text.startsWith('<!DOCTYPE')) {
    console.error('❌ Still getting HTML! Node.js not configured.');
  } else {
    console.log('✅ Got JSON:', JSON.parse(text));
  }
})
.catch(console.error)
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Application URL Missing /api

**Symptom:** Getting HTML 404 for all API calls

**Fix:**
- Set Application URL to: `nghc.nextgenproductlabs.com/api`
- Restart Node.js application

### Issue 2: Application Not Running

**Symptom:** Status shows "Stopped" or "Error"

**Fix:**
1. Check Node.js logs for errors
2. Verify `server.cjs` exists in `/api` folder
3. Verify `.env` file exists in `/api` folder
4. Click **Start** or **Restart**

### Issue 3: Wrong Application Root

**Symptom:** Node.js can't find `server.cjs`

**Fix:**
- Set Application Root to: `/api` or `/public_html/api`
- Verify `server.cjs` is in that location

### Issue 4: Port Conflict

**Symptom:** Node.js fails to start

**Fix:**
- Check what port is assigned in Node.js Manager
- Update `.env` file with correct PORT
- Restart application

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] Node.js Application URL = `nghc.nextgenproductlabs.com/api`
- [ ] Node.js Application Root = `/api` or `/public_html/api`
- [ ] Node.js Status = **Running** (green)
- [ ] `https://nghc.nextgenproductlabs.com/api/health` returns JSON
- [ ] Browser console shows no "Unexpected token '<'" errors
- [ ] Address verification works in frontend form

---

## 🔧 Quick Fix Summary

**90% of cases - This fixes it:**

1. **hPanel → Advanced → Node.js**
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

## 📦 Updated Frontend Code

I've updated the frontend code to:
1. **Detect HTML responses** and show helpful error messages
2. **Prevent JSON parse errors** by checking content type first
3. **Provide clear error messages** pointing to the fix

**After fixing Node.js configuration, rebuild and upload:**
```bash
npm run build
```

Then upload new `dist/` files via FTP.

---

**The fix is almost always: Set Application URL to include `/api`!**

