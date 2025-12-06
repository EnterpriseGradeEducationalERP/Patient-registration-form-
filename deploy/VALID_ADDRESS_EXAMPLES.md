# ✅ Valid Address Examples for Testing

## 🏆 Best Address: White House (Recommended)

**Why this is the best:**
- ✅ Always verifies successfully
- ✅ Returns complete ZIP+4 code
- ✅ Has full metadata (coordinates, county)
- ✅ Well-known address, easy to verify

**Form Fields:**
```
Apt. No:        (empty)
Address 1:      1600 Pennsylvania Avenue NW
Address 2:      (empty)
Street:         (empty)
City:           Washington
State:          District of Columbia
ZIP Code:       20500
```

**Expected Result:**
- ✅ Verified successfully
- ✅ ZIP+4: `20500-0003`
- ✅ Full metadata returned

---

## 📍 Other Reliable Test Addresses

### 1. Times Square
```
Address 1: 1 Times Square
City: New York
State: New York
ZIP Code: 10036
```

### 2. Empire State Building
```
Address 1: 350 5th Ave
City: New York
State: New York
ZIP Code: 10118
```

### 3. Statue of Liberty
```
Address 1: Liberty Island
City: New York
State: New York
ZIP Code: 10004
```

### 4. Golden Gate Bridge
```
Address 1: Golden Gate Bridge
City: San Francisco
State: California
ZIP Code: 94129
```

### 5. Address with Apartment
```
Apt. No: 4B
Address 1: 123 Main Street
City: Schenectady
State: New York
ZIP Code: 12305
```

---

## 📋 Quick Reference

### Minimum Required Fields:
- ✅ **Address 1** (required)
- ✅ **City** (required)
- ✅ **State** (required)
- ✅ **ZIP Code** (required - 5 digits)

### Optional Fields:
- Apt. No (if applicable)
- Address 2 (if applicable)
- Street (can leave empty)

---

## 🎯 Testing Checklist

When testing address verification:

- [ ] Use White House address first (most reliable)
- [ ] Test with apartment number
- [ ] Test with your actual address
- [ ] Verify ZIP+4 code is returned
- [ ] Check that address fields auto-fill after verification
- [ ] Confirm form allows proceeding after verification

---

## 💡 Pro Tips

1. **Start with White House** - Always works, best for initial testing
2. **Test edge cases** - Apartment numbers, unit numbers, etc.
3. **Use real addresses** - Test with addresses you know are valid
4. **Check ZIP+4** - Successful verification should return ZIP+4 code

---

**Use the White House address for the most reliable testing! 🏆**

