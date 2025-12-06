# Smarty API Analysis & Comparison

## Executive Summary

This document analyzes the Smarty address verification API documentation and compares it with the current USPS-based implementation in the patient registration system.

---

## Current Implementation Overview

### Services in Use:
1. **USPS Web Tools API** (`uspsService.cjs`)
   - Legacy XML-based API
   - Requires USPS User ID
   - Simple authentication

2. **USPS Addresses 3.0 API** (`uspsAddresses3Service.cjs`)
   - Modern REST API with OAuth 2.0
   - Requires Client ID and Client Secret
   - Token-based authentication with caching

3. **Pharmacy Service** (`pharmacyService.cjs`)
   - Uses OpenStreetMap Nominatim (FREE)
   - No API key required
   - Rate-limited (1 req/sec)

---

## Smarty API Analysis

### Key Features from Documentation

#### 1. **Authentication Methods**

**Embedded Keys:**
- For client-side code (JavaScript, mobile apps, desktop apps)
- Hostname/IP-based restrictions (max 100 hosts per key)
- Rate-limited by default
- Can whitelist IPs to remove rate limits
- **Security Note:** Cannot be used from public cloud provider IPs (AWS, Azure, VPN) unless whitelisted

**Secret Keys:**
- For server-side code only
- Consists of `auth-id` and `auth-token` pair
- No hostname restrictions
- More secure for backend services
- **Warning:** Must never be exposed in client-side code

#### 2. **API Endpoints Available**

Based on the documentation structure, Smarty offers:

- **US Street Address API** - Address verification
- **US ZIP Code API** - ZIP code lookups
- **US Autocomplete Pro API** - Address autocomplete
- **US Extract API** - Extract addresses from text
- **US Reverse Geocoding API** - Coordinates to address
- **US Address Enrichment API** - Additional property data
- **International APIs** - For non-US addresses

#### 3. **Base URL Structure**

```
https://us-street.api.smarty.com/street-address
https://us-zipcode.api.smarty.com/lookup
```

#### 4. **Request Format**

**With Embedded Key:**
```
https://us-street.api.smarty.com/street-address
  ?street=123+main+Schenectady+NY
  &key=4236410529599436
```

**With Secret Key:**
```
https://us-street.api.smarty.com/street-address
  ?street=123+main+Schenectady+NY
  &auth-id=8d497be5-e211-4949-a18f-0bfd1d9970d3
  &auth-token=th4hargQiuyG7w7L7xfO
```

---

## Comparison: Smarty vs USPS

### Advantages of Smarty

1. **Modern REST API**
   - JSON-based (vs USPS XML)
   - Easier to integrate
   - Better error handling

2. **Multiple Authentication Options**
   - Embedded keys for client-side
   - Secret keys for server-side
   - More flexible than USPS OAuth

3. **Additional Features**
   - Address autocomplete
   - Reverse geocoding
   - Property data enrichment
   - International address support

4. **Better Documentation**
   - Live API playground
   - Comprehensive SDKs
   - Postman collections

5. **42-Day Free Trial**
   - No credit card required initially
   - Good for testing

### Disadvantages of Smarty

1. **Cost**
   - Paid service (after trial)
   - USPS is free for basic verification

2. **Rate Limiting**
   - Embedded keys are rate-limited
   - May require IP whitelisting for high volume

3. **Cloud Provider Restrictions**
   - Embedded keys blocked from AWS/Azure IPs
   - Requires proxy or IP whitelisting

4. **Learning Curve**
   - New API to learn
   - Different response format

### Advantages of Current USPS Implementation

1. **Free**
   - No cost for basic address verification
   - Good for low-volume applications

2. **Official USPS Data**
   - Direct from US Postal Service
   - Most authoritative source

3. **Already Integrated**
   - Working implementation
   - Fallback between old and new APIs

### Disadvantages of Current USPS Implementation

1. **Complex Setup**
   - OAuth 2.0 for modern API
   - Token management required
   - Two different API versions

2. **XML-Based (Legacy)**
   - Older API uses XML
   - More complex parsing

3. **Limited Features**
   - Basic address verification only
   - No autocomplete
   - No enrichment data

---

## Integration Recommendations

### Option 1: Replace USPS with Smarty (Full Migration)

**Pros:**
- Modern REST API
- Better features (autocomplete, enrichment)
- Cleaner codebase
- Better documentation

**Cons:**
- Cost (after trial)
- Migration effort
- Need to update all address verification calls

**Implementation Steps:**
1. Create `smartyService.cjs` similar to current USPS services
2. Use secret keys for server-side authentication
3. Update `/api/verify-address` endpoint
4. Test thoroughly with 42-day trial
5. Update frontend if response format differs

### Option 2: Add Smarty as Alternative/Enhancement

**Pros:**
- Keep USPS as fallback
- Add autocomplete feature
- Test Smarty without removing USPS
- Gradual migration

**Cons:**
- More code to maintain
- Two different APIs
- Potential confusion

**Implementation Steps:**
1. Create `smartyService.cjs`
2. Add new endpoint `/api/verify-address-smarty`
3. Add autocomplete endpoint `/api/autocomplete-address`
4. Keep USPS as primary, Smarty as optional enhancement

### Option 3: Hybrid Approach

**Use Smarty for:**
- Address autocomplete (not available in USPS)
- Address enrichment (property data)
- International addresses

**Use USPS for:**
- Basic US address verification (free)
- ZIP code lookups

---

## Technical Implementation Notes

### Smarty Service Structure (Proposed)

```javascript
class SmartyService {
    constructor() {
        this.authId = process.env.SMARTY_AUTH_ID || '';
        this.authToken = process.env.SMARTY_AUTH_TOKEN || '';
        this.baseUrl = 'https://us-street.api.smarty.com';
    }

    async verifyAddress(address) {
        // Similar structure to USPS services
        // Use secret keys for server-side
    }

    async autocompleteAddress(query) {
        // New feature not in USPS
    }
}
```

### Environment Variables Needed

```env
# Smarty Configuration
SMARTY_AUTH_ID=your_auth_id
SMARTY_AUTH_TOKEN=your_auth_token

# Keep USPS for fallback
USPS_CLIENT_ID=your_usps_client_id
USPS_CLIENT_SECRET=your_usps_client_secret
USPS_USER_ID=your_usps_user_id
```

---

## Cost Considerations

### Smarty Pricing
- 42-day free trial
- Pay-per-use pricing after trial
- Volume discounts available
- Check current pricing at smartystreets.com/pricing

### USPS Pricing
- Free for basic address verification
- No cost for ZIP code lookups
- Only cost is development time

---

## Recommendation

**For this patient registration system:**

1. **Short-term:** Keep USPS implementation (it's working and free)

2. **Consider Smarty if:**
   - You need address autocomplete (better UX)
   - You need international address support
   - You need property/enrichment data
   - You're experiencing USPS API issues
   - Budget allows for paid service

3. **Best approach:** Start with Option 2 (add Smarty as enhancement)
   - Add autocomplete feature using Smarty
   - Keep USPS for verification
   - Evaluate after trial period
   - Migrate fully if it proves valuable

---

## Next Steps

If you want to proceed with Smarty integration:

1. Sign up for 42-day free trial
2. Get API keys (secret keys for server-side)
3. Create `smartyService.cjs` service file
4. Implement address verification method
5. Add autocomplete endpoint
6. Test thoroughly
7. Update frontend if needed
8. Evaluate cost vs. benefits after trial

---

## Questions to Consider

1. **Volume:** How many address verifications per month?
2. **Budget:** Is paid service acceptable?
3. **Features:** Do you need autocomplete or enrichment?
4. **International:** Do you need non-US address support?
5. **Timeline:** When do you need this implemented?

---

*Analysis Date: Based on Smarty documentation provided*
*Current Implementation: USPS Web Tools + USPS Addresses 3.0 APIs*

