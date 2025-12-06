# 🔧 Complete Fix Guide - API 404 + Smarty Integration

## 🎯 The Two Issues

### Issue 1: API 404 Error (Routing)
**Symptom:** "This Page Does Not Exist" HTML page  
**Cause:** Apache doesn't forward `/api/*` to Node.js  
**Fix:** Configure Node.js routing in hPanel

### Issue 2: Smarty Credentials
**Symptom:** Address verification fails (if API works)  
**Cause:** Credentials not in `.env` file  
**Fix:** Add credentials to `.env` and Node.js Manager

---

## ✅ Complete Solution

### PART 1: Fix API Routing (Do This First!)

**In hPanel → Node.js Manager:**

1. **Application Settings:**
   ```
   Application URL: yourdomain.com/api
   Application Root: /api or /public_html/api
   Startup File: server.cjs
   Port: 3000 (or auto)
   ```

2. **Test:**
   ```
   https://yourdomain.com/api/health
   ```
   ✅ Should return JSON  
   ❌ If 404, routing not fixed yet

### PART 2: Add Smarty Credentials

**Step 1: Create .env File**

In `public_html/api/` folder, create `.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API ✅
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
```

**Step 2: Add to Node.js Manager**

In hPanel → Node.js Manager → Environment Variables:

```
SMARTY_AUTH_ID = 1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN = SZkQ3ygTc5hiVL6RC9KR
MONGODB_URI = (your connection string)
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://yourdomain.com
```

**Step 3: Restart Node.js Application**

### PART 3: Verify Everything Works

1. **Test API:**
   ```
   https://yourdomain.com/api/health
   ```
   → Should return JSON

2. **Check Logs:**
   - Should see: `✅ Smarty Streets API configured`
   - Should see: `✅ Smarty credentials found`

3. **Test Address Verification:**
   - Use form to verify address
   - Should work without errors

---

## 🔍 Diagnostic Steps

### If Still Getting 404:

1. **Check Node.js Status:**
   - Is application running?
   - Check logs for errors

2. **Check Application URL:**
   - Must include `/api` path
   - Or use subdomain: `api.yourdomain.com`

3. **Test Direct:**
   - Try: `https://yourdomain.com/api/health`
   - If 404 → Routing issue
   - If JSON → Routing works!

### If API Works But Verification Fails:

1. **Check Credentials:**
   - In `.env` file
   - In Node.js Manager environment variables
   - Exact values (no spaces, no quotes)

2. **Check Logs:**
   - Look for credential errors
   - Look for Smarty API errors

---

## ✅ Success Indicators

**API Routing Fixed:**
- ✅ `/api/health` returns JSON
- ✅ No more 404 HTML pages
- ✅ API requests reach Node.js

**Smarty Integrated:**
- ✅ Server logs show "✅ Smarty Streets API configured"
- ✅ Address verification works
- ✅ Returns verified address with ZIP+4

---

## 📋 Final Checklist

- [ ] Node.js Application URL includes `/api`
- [ ] Node.js application is running
- [ ] `.env` file created with Smarty credentials
- [ ] Environment variables added in Node.js Manager
- [ ] Node.js application restarted
- [ ] `/api/health` returns JSON
- [ ] Server logs show Smarty configured
- [ ] Address verification works in form

---

**Both issues must be fixed for address verification to work!**


