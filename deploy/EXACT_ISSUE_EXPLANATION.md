# 🔍 Exact Issue Explanation - API 404 Error

## What's Happening

When you try to verify an address, here's the exact flow:

1. **Frontend makes request:**
   ```
   POST https://yourdomain.com/api/verify-address
   ```

2. **Apache receives the request:**
   - Apache looks for a file at `/api/verify-address`
   - No such file exists (it's a Node.js route, not a file)
   - Apache doesn't know to forward it to Node.js
   - Apache returns: "This Page Does Not Exist" (404 error)

3. **Node.js never receives the request:**
   - Your Express server is running on port 3000
   - But Apache isn't forwarding `/api/*` requests to it
   - The request never reaches your Node.js application

---

## 🎯 Root Cause

**Apache and Node.js are not connected.**

- ✅ Your Node.js app is running (probably on port 3000)
- ✅ Your Express routes are correct (`/api/verify-address`)
- ❌ Apache doesn't know to forward `/api/*` requests to Node.js
- ❌ No reverse proxy configured

---

## ✅ Solutions (Choose One)

### Solution 1: Configure Node.js Application URL (Easiest)

**How Hostinger Node.js Works:**
- Hostinger's Node.js Manager can route requests to your app
- You need to configure it correctly

**Steps:**

1. **In hPanel → Node.js Manager:**
   - Find your application
   - **Application Root:** `/api` or `/public_html/api`
   - **Application URL:** `yourdomain.com/api` (MUST include `/api`)
   - **OR** Application URL: `yourdomain.com` with **Application Path:** `/api`

2. **Check Application Settings:**
   - Some Hostinger setups have "Application Path" or "Base Path"
   - Set this to `/api` if available

3. **Test:**
   ```
   https://yourdomain.com/api/health
   ```
   - If this works → Node.js is configured correctly
   - If this fails → Continue to Solution 2

---

### Solution 2: Use Subdomain for API (Most Reliable)

**Why This Works:**
- Subdomain points directly to Node.js
- No Apache routing needed
- Cleaner separation

**Steps:**

1. **Create Subdomain:**
   - hPanel → Domains → Subdomains
   - Create: `api.yourdomain.com`
   - Point to: `public_html/api` (or just `api`)

2. **Configure Node.js:**
   - Application URL: `api.yourdomain.com`
   - Application Root: `/api` (or wherever your files are)

3. **Update Frontend:**
   - Rebuild with: `VITE_API_URL=https://api.yourdomain.com`
   - Or update in `.env` and rebuild

4. **Test:**
   ```
   https://api.yourdomain.com/health
   ```

---

### Solution 3: Configure Apache Reverse Proxy (If Supported)

**Check if Hostinger supports mod_proxy:**

1. **Try adding to `.htaccess`:**
   ```apache
   <IfModule mod_proxy.c>
     ProxyPreserveHost On
     ProxyPass /api http://localhost:3000/api
     ProxyPassReverse /api http://localhost:3000/api
   </IfModule>
   ```

2. **If this doesn't work:**
   - Contact Hostinger support
   - Ask: "Do you support Apache mod_proxy for reverse proxy?"
   - If yes, they can enable it

---

### Solution 4: Move API Routes to Root (Workaround)

**Change Express routes to not use `/api` prefix:**

1. **In `server.cjs`, change:**
   ```javascript
   // Change from:
   app.post('/api/verify-address', ...)
   
   // To:
   app.post('/verify-address', ...)
   ```

2. **Update frontend to call:**
   ```
   /verify-address (instead of /api/verify-address)
   ```

3. **Configure Node.js:**
   - Application URL: `yourdomain.com`
   - Application Root: `/api` or `/public_html/api`

**⚠️ This requires code changes - not recommended**

---

## 🔍 Diagnostic Steps

### Step 1: Check if Node.js is Running

1. **In hPanel → Node.js Manager:**
   - Check application status
   - Should be "Running" or "Active"
   - View logs - should see: `🚀 Server running on port 3000`

### Step 2: Test Direct Access

Try accessing your Node.js app directly:

**If using subdomain:**
```
https://api.yourdomain.com/health
```

**If using port:**
```
http://yourdomain.com:3000/api/health
```

**If this works:**
- Node.js is running correctly
- Issue is Apache routing

**If this doesn't work:**
- Node.js isn't running or configured incorrectly
- Fix Node.js setup first

### Step 3: Check Browser Network Tab

1. **Open DevTools (F12) → Network tab**
2. **Try address verification**
3. **Look at the request:**
   - **URL:** What URL is being called?
   - **Status:** What status code?
   - **Response:** HTML (404) or JSON?

**What to look for:**
- If URL is `yourdomain.com/api/verify-address` → Routing issue
- If URL is `localhost:3000/api/verify-address` → Frontend config issue
- If Status is 404 → Apache routing issue
- If Status is 500 → Node.js error (check logs)

---

## 🎯 Most Likely Solution

**90% of cases:** Solution 1 - Configure Node.js Application URL correctly

**In hPanel Node.js Manager:**
- **Application URL:** MUST include `/api` path
- **OR** Use "Application Path" setting if available
- **Application Root:** `/api` or `/public_html/api`

**Test immediately:**
```
https://yourdomain.com/api/health
```

If this returns JSON → Problem solved!
If this returns 404 → Try Solution 2 (subdomain)

---

## 📞 Still Not Working?

**Contact Hostinger Support with this information:**

1. "I have a Node.js application that needs to handle `/api/*` routes"
2. "Currently getting 404 errors when accessing `/api/*` endpoints"
3. "How do I configure Node.js Manager to route `/api/*` requests to my application?"
4. "Do you support Apache reverse proxy (mod_proxy)?"

---

## ✅ Quick Checklist

- [ ] Node.js application is running (check status in hPanel)
- [ ] Application URL includes `/api` path
- [ ] Tested `/api/health` endpoint directly
- [ ] Checked browser Network tab for actual request URL
- [ ] Reviewed Node.js application logs for errors

---

**The exact issue: Apache doesn't forward `/api/*` requests to your Node.js application. Fix the Node.js routing configuration in hPanel!**


