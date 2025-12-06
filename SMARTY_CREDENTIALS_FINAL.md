# 🔑 Smarty API Credentials - Production Ready
## nghc.nextgenproductlabs.com

---

## ✅ Your Smarty API Credentials

### Secret Keys (Server-Side - Currently Used)
```
Auth ID: 1661d522-1b74-452f-bb63-463bdedd9fa3
Auth Token: SZkQ3ygTc5hiVL6RC9KR
```

**Status:** ✅ **CONFIGURED AND READY**

### Embedded Key (Client-Side - For Future Use)
```
Embedded Key: 254574191005277116
```

**Note:** Currently using Secret Keys for server-side. Embedded key is available if needed for client-side integration in the future.

---

## 📋 Where These Credentials Are Used

### 1. `.env` File (Server)
**Location:** `public_html/api/.env`

**Required Variables:**
```env
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
SMARTY_EMBEDDED_KEY=254574191005277116
```

### 2. Node.js Manager (hPanel)
**Location:** hPanel → Advanced → Node.js → Environment Variables

**Add these variables:**
- `SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3`
- `SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR`
- `SMARTY_EMBEDDED_KEY=254574191005277116`

**Note:** You can set these in `.env` file OR in Node.js Manager. Both work, but `.env` file is recommended.

---

## 🔧 API Endpoints Using Smarty

### 1. Address Verification
**Endpoint:** `POST /api/verify-address`

**Uses:** Smarty Streets US Street Address API
- **Base URL:** `https://us-street.api.smarty.com/street-address`
- **Authentication:** Secret Keys (Auth ID + Auth Token)

### 2. ZIP Code Lookup
**Endpoint:** `GET /api/zip-lookup/:zip5`

**Uses:** Smarty Streets US ZIP Code API
- **Base URL:** `https://us-zipcode.api.smarty.com/lookup`
- **Authentication:** Secret Keys (Auth ID + Auth Token)

### 3. Address Autocomplete (Bonus Feature)
**Endpoint:** `GET /api/autocomplete-address`

**Uses:** Smarty Streets US Autocomplete Pro API
- **Base URL:** `https://us-autocomplete-pro.api.smarty.com/lookup`
- **Authentication:** Secret Keys (Auth ID + Auth Token)

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] `.env` file exists in `public_html/api/`
- [ ] `SMARTY_AUTH_ID` is set correctly
- [ ] `SMARTY_AUTH_TOKEN` is set correctly
- [ ] Node.js application is running
- [ ] Test address verification: `https://nghc.nextgenproductlabs.com/api/verify-address`
- [ ] Check Node.js logs for: `✅ Smarty Streets API configured`

---

## 🧪 Test Address Verification

### Test Endpoint:
```
POST https://nghc.nextgenproductlabs.com/api/verify-address
```

### Test Request:
```json
{
  "address1": "1600 Pennsylvania Ave NW",
  "city": "Washington",
  "state": "DC",
  "zip5": "20500"
}
```

### Expected Response:
```json
{
  "success": true,
  "verified": true,
  "address": {
    "address1": "1600 PENNSYLVANIA AVE NW",
    "city": "WASHINGTON",
    "state": "DC",
    "zip5": "20500",
    "zip4": "0003"
  },
  "verificationMessage": "Address verified with ZIP+4"
}
```

---

## 🔍 Troubleshooting

### Issue: "Smarty credentials not configured"

**Solution:**
1. Check `.env` file exists in `public_html/api/`
2. Verify credentials are correct (no extra spaces)
3. Restart Node.js application
4. Check Node.js logs

### Issue: "Smarty API authentication failed"

**Solution:**
1. Verify Auth ID and Auth Token are correct
2. Check for typos in credentials
3. Ensure credentials are in `.env` file
4. Restart Node.js application

### Issue: "Smarty API subscription issue"

**Solution:**
1. Check Smarty account status
2. Verify billing is active
3. Check API usage limits

---

## 📝 Quick Reference

**Credentials:**
- Auth ID: `1661d522-1b74-452f-bb63-463bdedd9fa3`
- Auth Token: `SZkQ3ygTc5hiVL6RC9KR`
- Embedded Key: `254574191005277116`

**API Base URLs:**
- Street Address: `https://us-street.api.smarty.com`
- ZIP Code: `https://us-zipcode.api.smarty.com`
- Autocomplete: `https://us-autocomplete-pro.api.smarty.com`

**Documentation:** https://www.smarty.com/docs

---

**Status:** ✅ **READY FOR PRODUCTION**

