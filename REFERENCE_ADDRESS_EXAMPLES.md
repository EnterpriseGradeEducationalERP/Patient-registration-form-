# Reference Address Examples for Smarty Validation

## ✅ Valid Test Addresses

### Example 1: Standard Residential Address (Recommended for Testing)

**Form Fields:**
```
Apt. No: (leave empty or use: 101)
Address 1: 1600 Pennsylvania Avenue NW
Address 2: (leave empty)
Street: (leave empty or same as Address 1)
City: Washington
State: District of Columbia (or DC)
ZIP Code: 20500
```

**What Smarty Will Receive:**
```json
{
  "address1": "1600 Pennsylvania Avenue NW",
  "address2": "",
  "city": "Washington",
  "state": "DC",
  "zip5": "20500"
}
```

**Expected Result:** ✅ Should verify successfully (White House address)

---

### Example 2: Address with Apartment Number

**Form Fields:**
```
Apt. No: 4B
Address 1: 123 Main Street
Address 2: (leave empty)
Street: (leave empty)
City: Schenectady
State: New York
ZIP Code: 12305
```

**What Smarty Will Receive:**
```json
{
  "address1": "123 Main Street #4B",
  "address2": "",
  "city": "Schenectady",
  "state": "NY",
  "zip5": "12305"
}
```

**Expected Result:** ✅ Should verify successfully

---

### Example 3: Address with Unit Already in Address1

**Form Fields:**
```
Apt. No: 743
Address 1: 08 W Farm To Market 544 #107
Address 2: (leave empty)
Street: (leave empty or ignore)
City: Murphy
State: Texas
ZIP Code: 75094
```

**What Smarty Will Receive:**
```json
{
  "address1": "08 W Farm To Market 544 #107",
  "address2": "743",
  "city": "Murphy",
  "state": "TX",
  "zip5": "75094"
}
```

**Expected Result:** ✅ Should verify successfully (your current address)

---

### Example 4: Simple Street Address

**Form Fields:**
```
Apt. No: (leave empty)
Address 1: 1 Times Square
Address 2: (leave empty)
Street: (leave empty)
City: New York
State: New York
ZIP Code: 10036
```

**What Smarty Will Receive:**
```json
{
  "address1": "1 Times Square",
  "address2": "",
  "city": "New York",
  "state": "NY",
  "zip5": "10036"
}
```

**Expected Result:** ✅ Should verify successfully

---

## 🎯 Best Reference Address for Testing

### Recommended: White House Address

**Complete Form Data:**
```
Apt. No: (empty)
Address 1: 1600 Pennsylvania Avenue NW
Address 2: (empty)
Street: (empty)
City: Washington
State: District of Columbia
ZIP Code: 20500
```

**Why This Works:**
- ✅ Well-known, valid address
- ✅ Always verifies successfully
- ✅ Returns ZIP+4 code
- ✅ Has complete metadata (coordinates, county, etc.)

**Expected Verification Result:**
```json
{
  "success": true,
  "verified": true,
  "address": {
    "address1": "1600 Pennsylvania Avenue NW",
    "address2": "",
    "city": "Washington",
    "state": "DC",
    "zip5": "20500",
    "zip4": "0003"
  },
  "message": "Address verified with ZIP+4",
  "metadata": {
    "precision": "Zip9",
    "county": "District of Columbia",
    "latitude": 38.8977,
    "longitude": -77.0365
  }
}
```

---

## 📝 Quick Copy-Paste Examples

### For Testing (Copy these into your form):

**Option 1 - White House:**
```
Address 1: 1600 Pennsylvania Avenue NW
City: Washington
State: District of Columbia
ZIP: 20500
```

**Option 2 - Times Square:**
```
Address 1: 1 Times Square
City: New York
State: New York
ZIP: 10036
```

**Option 3 - Empire State Building:**
```
Address 1: 350 5th Ave
City: New York
State: New York
ZIP: 10118
```

**Option 4 - Your Current Address (Fixed):**
```
Apt. No: 743
Address 1: 08 W Farm To Market 544 #107
City: Murphy
State: Texas
ZIP: 75094
```

---

## ✅ Validation Checklist

When testing, make sure:
- [ ] Address 1 is filled (required)
- [ ] City is filled (required)
- [ ] State is filled (required)
- [ ] ZIP Code is 5 digits (required)
- [ ] Street field is empty or matches Address 1 (to avoid confusion)

---

## 🔍 What Happens During Validation

1. **Form Data → Smarty Format:**
   - Address1 takes priority over Street
   - Apt. No is combined intelligently
   - State name converted to 2-letter code

2. **Smarty API Call:**
   - Validates address exists
   - Standardizes format
   - Adds ZIP+4 if available
   - Returns metadata

3. **Response → Form:**
   - Verified address applied to form
   - ZIP+4 displayed if available
   - Success message shown

---

**Use any of these addresses to test your validation!**

