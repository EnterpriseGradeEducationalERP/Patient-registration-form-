# Smarty Address Verification - Troubleshooting Guide

## 🔴 Error: "Authorization failure. Perhaps username and/or password is incorrect"

This error indicates that the Smarty API credentials are either:
1. **Not configured** in your `.env` file
2. **Incorrect** (wrong Auth ID or Token)
3. **Not loaded** (server needs restart after adding to `.env`)

---

## ✅ Solution Steps

### Step 1: Check Your `.env` File

Open your `.env` file in the project root and verify you have:

```env
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
```

**Important:**
- No spaces around the `=` sign
- No quotes around the values
- No trailing spaces
- File is named exactly `.env` (not `.env.txt`)

### Step 2: Restart Your Server

After adding/updating credentials in `.env`:

1. **Stop the server** (Ctrl+C in terminal)
2. **Start it again:**
   ```bash
   node server.cjs
   ```

The server must be restarted to load new environment variables!

### Step 3: Verify Server Logs

When the server starts, you should see:

```
✅ Smarty Streets API configured
```

If you see this instead:
```
⚠️  Smarty credentials not found in .env
```

Then your credentials are not being loaded.

### Step 4: Test Credentials

Check the server console when you try to verify an address. You should see:

```
✅ Smarty credentials found
   Auth ID: 1661d522...
   Auth Token: SZkQ...
📡 Verifying address with Smarty Streets API
```

---

## 🔍 Common Issues

### Issue 1: Credentials Not in `.env`

**Symptom:** Error about credentials not configured

**Solution:**
1. Create `.env` file in project root (if it doesn't exist)
2. Add the credentials exactly as shown above
3. Restart server

### Issue 2: Wrong File Location

**Symptom:** Server can't find credentials

**Solution:**
- `.env` file must be in the **project root** (same folder as `server.cjs`)
- Not in `server/` folder
- Not in `src/` folder

### Issue 3: Server Not Restarted

**Symptom:** Added credentials but still getting errors

**Solution:**
- **Always restart server** after changing `.env` file
- Environment variables are loaded when server starts
- Changes won't take effect until restart

### Issue 4: Incorrect Credentials

**Symptom:** Getting authentication errors even with credentials set

**Solution:**
1. Double-check credentials in your Smarty account:
   - Go to https://www.smarty.com/
   - Log in
   - Go to Account → API Keys
   - Check Secret Keys section
   - Verify Auth ID and Token match

2. Make sure you're using **Secret Keys** (not Embedded Keys)
   - Secret Keys are for server-side use
   - They look like: `auth-id` and `auth-token`

### Issue 5: Typo in Variable Names

**Symptom:** Credentials not loading

**Solution:**
- Variable names must be **exact**:
  - `SMARTY_AUTH_ID` (not `SMARTY_AUTHID` or `SMARTY_AUTH_ID`)
  - `SMARTY_AUTH_TOKEN` (not `SMARTY_TOKEN` or `SMARTY_AUTHTOKEN`)

---

## 🧪 Testing Your Setup

### Test 1: Check Server Startup

When you start the server, look for:

```
✅ Smarty Streets API configured
```

If you see:
```
⚠️  Smarty credentials not found in .env
```

Then credentials are missing or not loaded.

### Test 2: Check Address Verification

Try verifying an address. In server console, you should see:

```
✅ Smarty credentials found
   Auth ID: 1661d522...
   Auth Token: SZkQ...
📡 Verifying address with Smarty Streets API
```

If you see authentication errors, check:
1. Credentials are correct
2. Server was restarted
3. `.env` file is in correct location

---

## 📝 Quick Checklist

- [ ] `.env` file exists in project root
- [ ] `SMARTY_AUTH_ID` is set in `.env`
- [ ] `SMARTY_AUTH_TOKEN` is set in `.env`
- [ ] No spaces around `=` in `.env`
- [ ] No quotes around values in `.env`
- [ ] Server was restarted after adding credentials
- [ ] Server logs show "✅ Smarty Streets API configured"
- [ ] Credentials match your Smarty account

---

## 🆘 Still Having Issues?

### Check Server Console

Look for error messages when:
1. Server starts
2. You try to verify an address

### Verify Credentials

1. Log in to Smarty: https://www.smarty.com/
2. Go to Account → API Keys
3. Check Secret Keys section
4. Copy Auth ID and Token exactly
5. Update `.env` file
6. Restart server

### Test API Directly

You can test if credentials work by making a direct API call:

```bash
curl "https://us-street.api.smarty.com/street-address?auth-id=YOUR_AUTH_ID&auth-token=YOUR_AUTH_TOKEN&street=123+Main+St&city=Schenectady&state=NY&zipcode=12345"
```

Replace `YOUR_AUTH_ID` and `YOUR_AUTH_TOKEN` with your actual credentials.

---

## ✅ Expected Behavior

When everything is configured correctly:

1. **Server starts:**
   ```
   ✅ Smarty Streets API configured
   ```

2. **Address verification:**
   ```
   ✅ Smarty credentials found
   📡 Verifying address with Smarty Streets API
   ```

3. **Frontend shows:**
   - Success: Green banner with "Address verified by Smarty"
   - Error: Red banner with specific error message (not "Authorization failure")

---

**If you're still seeing "Authorization failure" errors, the most common cause is that the server needs to be restarted after adding credentials to `.env`.**

