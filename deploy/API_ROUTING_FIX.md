# 🔧 API Routing Fix - Address Verification Error

## Problem

When verifying an address, you get a 404 error page from Hostinger instead of the API response.

**Error:** "This Page Does Not Exist" HTML page

## Root Cause

The frontend is trying to call `/api/verify-address` but Apache doesn't know how to route it to your Node.js application.

## ✅ Solution

### Option 1: Configure Node.js Application Path (Recommended)

1. **In hPanel → Node.js Manager:**
   - Find your Node.js application
   - **Application Root:** Should be `/api` or `/public_html/api`
   - **Application URL:** Should be `yourdomain.com/api` or auto-configured
   - **Startup File:** `server.cjs`
   - **Port:** `3000` (or auto-assigned)

2. **Verify Application is Running:**
   - Check logs in Node.js Manager
   - Should see: `🚀 Server running on port 3000`
   - Test: Visit `https://yourdomain.com/api/health`
   - Should return JSON: `{"status":"ok",...}`

### Option 2: Use Subdomain for API

1. **Create API Subdomain:**
   - hPanel → Domains → Subdomains
   - Create: `api.yourdomain.com`
   - Point to: `public_html/api`

2. **Update Environment Variables:**
   - In `.env` file: `VITE_API_URL=https://api.yourdomain.com`
   - Rebuild frontend: `npm run build`
   - Re-upload `dist/` folder

3. **Configure Node.js:**
   - Application URL: `api.yourdomain.com`
   - Application Root: `/api`

### Option 3: Configure Apache Reverse Proxy

If Hostinger supports reverse proxy, add to `.htaccess`:

```apache
# Proxy API requests to Node.js
<IfModule mod_proxy.c>
  ProxyPreserveHost On
  ProxyPass /api http://localhost:3000/api
  ProxyPassReverse /api http://localhost:3000/api
</IfModule>
```

**Note:** This requires `mod_proxy` to be enabled (contact Hostinger support).

---

## 🔍 Verification Steps

1. **Test API Health Endpoint:**
   ```
   https://yourdomain.com/api/health
   ```
   Should return: `{"status":"ok","mongodb":"connected"}`

2. **Test Address Verification:**
   - Open browser console (F12)
   - Try to verify an address
   - Check Network tab for API call
   - Should see request to `/api/verify-address`
   - Should get JSON response, not HTML

3. **Check Server Logs:**
   - Node.js Manager → View Logs
   - Should see API requests logged
   - Check for any errors

---

## 📝 Updated Files

The following files have been updated to use relative API paths:

- ✅ `src/services/api.js` - Uses `/api` in production
- ✅ `src/services/addressApi.js` - Uses `/api` in production
- ✅ `src/services/pharmacyApi.js` - Uses `/api` in production
- ✅ `src/services/uspsApi.js` - Uses `/api` in production

**All API calls now use relative paths** (`/api`) instead of `http://localhost:3000/api`.

---

## 🎯 Quick Fix Checklist

- [ ] Node.js application is running in hPanel
- [ ] Application Root is set to `/api` or `/public_html/api`
- [ ] Application URL includes `/api` path
- [ ] Test `/api/health` endpoint works
- [ ] Frontend build uses relative paths (already fixed)
- [ ] `.htaccess` doesn't block API routes

---

## 🆘 Still Not Working?

1. **Check Node.js Application:**
   - Is it running? (Check status in Node.js Manager)
   - Are there any errors in logs?
   - Is the port correct?

2. **Check API Endpoint:**
   - Try: `https://yourdomain.com/api/health` directly in browser
   - If it works, the issue is frontend configuration
   - If it doesn't, the issue is Node.js setup

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Network tab
   - Try address verification
   - See what URL is being called
   - Check response status and content

4. **Contact Hostinger Support:**
   - Ask about reverse proxy support
   - Ask about Node.js routing configuration
   - Request help with API path routing

---

## ✅ Expected Behavior After Fix

- ✅ Address verification works
- ✅ API calls return JSON, not HTML
- ✅ All API endpoints accessible
- ✅ No 404 errors

---

**The frontend code has been updated. You just need to ensure Node.js is properly configured in hPanel!**

