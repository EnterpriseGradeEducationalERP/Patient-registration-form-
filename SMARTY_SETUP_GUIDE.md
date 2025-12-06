# Smarty Address Verification - Complete Setup Guide

## ✅ What You Already Have

You've provided your **Secret Keys** (perfect for server-side use):
- **Auth ID:** `1661d522-1b74-452f-bb63-463bdedd9fa3`
- **Auth Token:** `SZkQ3ygTc5hiVL6RC9KR`

These are the **ONLY credentials you need** for server-side address verification!

---

## 📋 Complete Requirements Checklist

### ✅ Required (You Have These)
- [x] **Auth ID** - `1661d522-1b74-452f-bb63-463bdedd9fa3`
- [x] **Auth Token** - `SZkQ3ygTc5hiVL6RC9KR`
- [x] **Smarty Account** - You have one (since you have keys)

### 📝 Optional (For Future Features)
- [ ] **Embedded Key** - Only if you want client-side autocomplete
- [ ] **Hostname/IP Whitelist** - Only if using embedded keys

---

## 🔑 Understanding Smarty Authentication

### Secret Keys (What You Have) ✅
- **Use Case:** Server-side code (Node.js backend)
- **Security:** Must NEVER be exposed in client-side code
- **Location:** Environment variables (`.env` file)
- **Rate Limits:** Based on your plan, not by hostname
- **Perfect For:** Your current implementation

### Embedded Keys (Optional - For Future)
- **Use Case:** Client-side JavaScript, mobile apps
- **Security:** Tied to specific hostnames/IPs
- **Rate Limits:** Applied per hostname
- **When Needed:** If you want address autocomplete in browser

---

## 🚀 Step-by-Step Implementation

### Step 1: Add Environment Variables

Create or update your `.env` file in the project root:

```env
# Smarty Streets API Configuration
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR

# Keep your existing USPS credentials (for fallback)
USPS_CLIENT_ID=your_usps_client_id
USPS_CLIENT_SECRET=your_usps_client_secret
USPS_USER_ID=your_usps_user_id
```

**⚠️ Important:** 
- Never commit `.env` to Git
- Add `.env` to `.gitignore`
- Keep your Auth Token secret!

### Step 2: Verify Service File Created

The service file has been created at:
```
server/services/smartyService.cjs
```

This file contains:
- Address verification
- ZIP code lookup
- Address autocomplete (bonus feature)

### Step 3: Update Server to Use Smarty

The server needs to be updated to:
1. Import the Smarty service
2. Add Smarty as primary or fallback option

### Step 4: Test the Integration

Test with a sample address to verify it works.

---

## 📍 Where to Find Your API Keys (For Reference)

### If You Need to View/Regenerate Keys:

1. **Log in to Smarty Account**
   - Go to: https://www.smarty.com/
   - Click "Log In" or "Account"

2. **Navigate to API Keys**
   - Dashboard → API Keys
   - Or: Account → API Keys

3. **View Secret Keys**
   - Look for "Secret Keys" section
   - You'll see your Auth ID and Auth Token
   - You can regenerate if needed (old ones will stop working)

4. **View Embedded Keys (If Needed)**
   - Look for "Embedded Keys" section
   - Create new one if needed
   - Add hostnames/IPs for whitelisting

---

## 🔧 API Endpoints Available

### 1. US Street Address API (Address Verification)
```
https://us-street.api.smarty.com/street-address
```
**What it does:** Verifies and standardizes US addresses

**Parameters:**
- `street` - Street address (required)
- `city` - City (optional but recommended)
- `state` - State (2-letter code, optional but recommended)
- `zipcode` - ZIP code (optional but recommended)
- `secondary` - Apartment, suite, etc. (optional)
- `candidates` - Number of results (default: 1)

### 2. US ZIP Code API (ZIP Lookup)
```
https://us-zipcode.api.smarty.com/lookup
```
**What it does:** Gets city/state from ZIP code

**Parameters:**
- `zipcode` - 5-digit ZIP code (required)

### 3. US Autocomplete Pro API (Address Suggestions)
```
https://us-autocomplete-pro.api.smarty.com/lookup
```
**What it does:** Provides address suggestions as user types

**Parameters:**
- `search` - Partial address string (required)
- `max_results` - Number of suggestions (default: 10)

---

## 📝 Integration Options

### Option A: Replace USPS with Smarty (Recommended)

**Pros:**
- Cleaner codebase
- Modern REST API
- Better error handling
- Additional features available

**Implementation:**
- Update `/api/verify-address` to use Smarty first
- Keep USPS as fallback if needed

### Option B: Use Smarty as Primary, USPS as Fallback

**Pros:**
- Best of both worlds
- Redundancy if one fails
- Can compare results

**Implementation:**
- Try Smarty first
- Fall back to USPS if Smarty fails

### Option C: Add Smarty for New Features Only

**Pros:**
- Keep existing USPS working
- Add autocomplete feature
- Gradual migration

**Implementation:**
- Keep USPS for verification
- Add new `/api/autocomplete-address` endpoint using Smarty

---

## 🧪 Testing Your Setup

### Test 1: Verify Environment Variables

Create a test file `test-smarty.js`:

```javascript
require('dotenv').config();

console.log('Auth ID:', process.env.SMARTY_AUTH_ID ? '✅ Found' : '❌ Missing');
console.log('Auth Token:', process.env.SMARTY_AUTH_TOKEN ? '✅ Found' : '❌ Missing');
```

Run: `node test-smarty.js`

### Test 2: Test Address Verification

```javascript
const smartyService = require('./server/services/smartyService.cjs');

async function test() {
    const result = await smartyService.verifyAddress({
        address1: '123 Main St',
        city: 'Schenectady',
        state: 'NY',
        zip5: '12345'
    });
    
    console.log('Result:', JSON.stringify(result, null, 2));
}

test();
```

### Test 3: Test ZIP Lookup

```javascript
const smartyService = require('./server/services/smartyService.cjs');

async function test() {
    const result = await smartyService.getCityStateFromZip('12345');
    console.log('Result:', JSON.stringify(result, null, 2));
}

test();
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Store credentials in `.env` file
- Add `.env` to `.gitignore`
- Use Secret Keys for server-side
- Keep Auth Token private
- Rotate keys periodically

### ❌ DON'T:
- Commit `.env` to Git
- Expose Auth Token in client-side code
- Share keys in emails/messages
- Hardcode keys in source files
- Use Secret Keys in browser JavaScript

---

## 📊 Response Format

### Successful Address Verification:

```json
{
  "success": true,
  "verified": true,
  "address": {
    "address1": "123 Main St",
    "address2": "",
    "city": "Schenectady",
    "state": "NY",
    "zip5": "12345",
    "zip4": "6789"
  },
  "metadata": {
    "precision": "Zip9",
    "recordType": "Street",
    "county": "Schenectady County",
    "latitude": 42.8142,
    "longitude": -73.9396
  }
}
```

### Failed Address Verification:

```json
{
  "success": true,
  "verified": false,
  "error": "Address could not be verified",
  "address": null
}
```

---

## 🆘 Troubleshooting

### Issue: "Smarty credentials not configured"
**Solution:** Check your `.env` file has `SMARTY_AUTH_ID` and `SMARTY_AUTH_TOKEN`

### Issue: "Request timeout"
**Solution:** Check internet connection, Smarty API status

### Issue: "401 Unauthorized"
**Solution:** Verify Auth ID and Auth Token are correct

### Issue: "Address could not be verified"
**Solution:** This is normal for invalid addresses. Check the address format.

---

## 📞 Support Resources

- **Smarty Documentation:** https://www.smarty.com/docs
- **API Status:** https://status.smarty.com/
- **Support:** Contact through your Smarty account dashboard
- **Live API Playground:** https://www.smarty.com/docs/cloud/playground

---

## ✅ Next Steps

1. ✅ Add credentials to `.env` file
2. ✅ Service file created (`smartyService.cjs`)
3. ⏳ Update server to use Smarty
4. ⏳ Test address verification
5. ⏳ Update frontend if needed
6. ⏳ Deploy and monitor

---

## 🎯 Summary

**You have everything you need:**
- ✅ Auth ID: `1661d522-1b74-452f-bb63-463bdedd9fa3`
- ✅ Auth Token: `SZkQ3ygTc5hiVL6RC9KR`
- ✅ Service file created
- ⏳ Just need to add to `.env` and integrate!

**No additional keys needed for basic address verification!**

