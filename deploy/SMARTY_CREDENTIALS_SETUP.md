# 🔑 Smarty Credentials Integration Guide

## ✅ Your Smarty Credentials

**Auth ID:** `1661d522-1b74-452f-bb63-463bdedd9fa3`  
**Auth Token:** `SZkQ3ygTc5hiVL6RC9KR`

---

## 🎯 Issue Analysis

You're getting a 404 error when verifying addresses. This is actually **TWO separate issues**:

### Issue 1: API Routing (404 Error)
- **Problem:** Apache doesn't forward `/api/verify-address` to Node.js
- **Symptom:** "This Page Does Not Exist" HTML page
- **Solution:** Configure Node.js routing in hPanel (see below)

### Issue 2: Smarty Credentials
- **Problem:** Credentials need to be in `.env` file on server
- **Symptom:** Even if API works, address verification fails
- **Solution:** Add credentials to `.env` file (see below)

---

## ✅ Step-by-Step Fix

### Step 1: Add Smarty Credentials to .env File

**On your Hostinger server:**

1. **Navigate to:** `public_html/api/` folder
2. **Open or create:** `.env` file
3. **Add these lines:**

```env
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
```

4. **Complete .env file should look like:**

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
```

5. **Save the file**

### Step 2: Fix API Routing (Critical!)

**The 404 error is because Node.js isn't receiving the request.**

**In hPanel → Node.js Manager:**

1. **Find your Node.js application**
2. **Configure these settings:**

   **Option A (Recommended):**
   - **Application URL:** `yourdomain.com/api`
   - **Application Root:** `/api` or `/public_html/api`
   - **Startup File:** `server.cjs`
   - **Port:** `3000` (or auto-assigned)

   **Option B (If Option A doesn't work):**
   - Create subdomain: `api.yourdomain.com`
   - Point to: `public_html/api`
   - Set Application URL: `api.yourdomain.com`

3. **Add Environment Variables in Node.js Manager:**
   - `SMARTY_AUTH_ID` = `1661d522-1b74-452f-bb63-463bdedd9fa3`
   - `SMARTY_AUTH_TOKEN` = `SZkQ3ygTc5hiVL6RC9KR`
   - `MONGODB_URI` = (your MongoDB connection string)
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `FRONTEND_URL` = `https://yourdomain.com`

4. **Restart Node.js Application**

### Step 3: Verify Setup

1. **Test API Health:**
   ```
   https://yourdomain.com/api/health
   ```
   Should return JSON (not HTML)

2. **Check Server Logs:**
   - In Node.js Manager → View Logs
   - Should see: `✅ Smarty Streets API configured`
   - Should see: `✅ Smarty credentials found`

3. **Test Address Verification:**
   - Try verifying an address in the form
   - Should work without 404 error
   - Should verify successfully with Smarty API

---

## 🔍 Verification Checklist

- [ ] `.env` file created in `public_html/api/`
- [ ] `SMARTY_AUTH_ID` added to `.env`
- [ ] `SMARTY_AUTH_TOKEN` added to `.env`
- [ ] Environment variables added in Node.js Manager
- [ ] Node.js application restarted
- [ ] `/api/health` returns JSON (not 404)
- [ ] Server logs show "✅ Smarty Streets API configured"
- [ ] Address verification works in form

---

## 🐛 Troubleshooting

### Still Getting 404 Error?

**This means API routing isn't fixed yet.**

1. **Check Node.js Application:**
   - Is it running? (Check status in Node.js Manager)
   - Is Application URL set correctly?
   - Are there errors in logs?

2. **Test Direct Access:**
   - Try: `https://yourdomain.com/api/health`
   - If 404 → Routing issue (fix Node.js configuration)
   - If JSON → Routing works, check credentials

### Address Verification Fails (But No 404)?

**This means API is working but Smarty credentials are wrong.**

1. **Check .env file:**
   - Are credentials exactly as shown above?
   - No extra spaces or quotes?
   - File is in `public_html/api/` folder?

2. **Check Server Logs:**
   - Look for: "❌ Smarty credentials missing!"
   - Or: "✅ Smarty credentials found"

3. **Verify Credentials:**
   - Auth ID: `1661d522-1b74-452f-bb63-463bdedd9fa3`
   - Auth Token: `SZkQ3ygTc5hiVL6RC9KR`
   - No typos or extra characters

---

## 📝 Important Notes

1. **Credentials Location:**
   - Must be in `.env` file on server
   - Must also be in Node.js Manager environment variables
   - Never commit `.env` to version control

2. **API Routing:**
   - The 404 error is a routing issue, not a credentials issue
   - Fix Node.js routing first
   - Then verify credentials are set

3. **Security:**
   - Keep credentials secure
   - Don't share `.env` file publicly
   - Use environment variables in Node.js Manager

---

## ✅ Expected Result

After fixing both issues:

1. **API Request:**
   ```
   POST /api/verify-address
   ```
   → Returns JSON response (not 404 HTML)

2. **Address Verification:**
   - Form submits address
   - Smarty API verifies it
   - Returns verified address with ZIP+4
   - Form displays success message

3. **Server Logs:**
   ```
   ✅ Smarty Streets API configured
   ✅ Smarty credentials found
      Auth ID: 1661d522...
      Auth Token: SZkQ...
   📡 Verifying address with Smarty Streets API
   ✅ Address verified successfully
   ```

---

**Fix the API routing first, then add Smarty credentials. Both are needed for address verification to work!**


