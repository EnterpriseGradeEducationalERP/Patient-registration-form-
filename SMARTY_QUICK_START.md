# Smarty Integration - Quick Start Guide

## ✅ You Already Have Everything You Need!

**Your Credentials:**
- Auth ID: `1661d522-1b74-452f-bb63-463bdedd9fa3`
- Auth Token: `SZkQ3ygTc5hiVL6RC9KR`

---

## 🚀 3-Step Setup

### Step 1: Add to `.env` File

Create or edit `.env` in your project root:

```env
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
```

### Step 2: Restart Your Server

```bash
# Stop your server (Ctrl+C)
# Then restart it
node server.cjs
```

### Step 3: Test It!

Your existing address verification endpoint will now use Smarty automatically!

**Test with:**
```bash
POST http://localhost:3000/api/verify-address
Content-Type: application/json

{
  "address1": "123 Main St",
  "city": "Schenectady",
  "state": "NY",
  "zip5": "12345"
}
```

---

## 📍 What Was Added

### ✅ New Service File
- `server/services/smartyService.cjs` - Complete Smarty integration

### ✅ Updated Endpoints
- `/api/verify-address` - Now uses Smarty first, USPS as fallback
- `/api/zip-lookup/:zip5` - Now uses Smarty first, USPS as fallback

### ✅ New Endpoint (Bonus!)
- `/api/autocomplete-address?search=123+Main` - Address suggestions as user types

---

## 🔄 How It Works

**Priority Order:**
1. **Smarty** (if credentials configured) → Primary
2. **USPS Addresses 3.0** (if OAuth configured) → Fallback
3. **USPS Web Tools** (legacy) → Final fallback

**Result:** Your app always works, even if one service fails!

---

## 🧪 Quick Test

### Test Address Verification:
```bash
curl -X POST http://localhost:3000/api/verify-address \
  -H "Content-Type: application/json" \
  -d '{
    "address1": "123 Main St",
    "city": "Schenectady",
    "state": "NY",
    "zip5": "12345"
  }'
```

### Test ZIP Lookup:
```bash
curl http://localhost:3000/api/zip-lookup/12345
```

### Test Autocomplete (New!):
```bash
curl "http://localhost:3000/api/autocomplete-address?search=123+Main&maxResults=5"
```

---

## 📊 Response Format

### Successful Verification:
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
    "county": "Schenectady County",
    "latitude": 42.8142,
    "longitude": -73.9396
  }
}
```

---

## ⚠️ Important Notes

1. **Keep Credentials Secret**
   - Never commit `.env` to Git
   - Add `.env` to `.gitignore`

2. **Fallback System**
   - If Smarty fails, USPS is used automatically
   - No changes needed to your frontend code

3. **No Breaking Changes**
   - Existing endpoints work the same
   - Response format is compatible

---

## 🎯 That's It!

You're all set! Smarty is now integrated and will be used automatically for address verification.

**Need help?** Check `SMARTY_SETUP_GUIDE.md` for detailed documentation.

