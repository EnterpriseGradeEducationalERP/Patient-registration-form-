# Address Format for Smarty Validation

## 📋 Your Form Fields Mapping

Based on your form, here's how the fields map to Smarty API:

### Form Fields → Smarty API Mapping

| Form Field | Field Name | Smarty Parameter | Example Value |
|------------|-----------|-----------------|---------------|
| **Apt. No** | `resApt` | Combined with Address1 or Address2 | `743` |
| **Address 1** | `resAddress1` | `address1` (primary street) | `08 W Farm To Market 544 #107` |
| **Address 2** | `resAddress2` | `address2` (secondary/unit) | (empty) |
| **Street** | `resStreet` | Fallback if Address1 empty | `Alabama` (⚠️ incorrect) |
| **City** | `resCity` | `city` | `Murphy` |
| **State** | `resState` | `state` | `Texas` |
| **ZIP Code** | `resZip` | `zip5` | `75094` |

---

## ✅ Correct Address Format for Your Example

Based on your form data:
- **Apt. No:** `743`
- **Address 1:** `08 W Farm To Market 544 #107`
- **Address 2:** (empty)
- **Street:** `Alabama` ⚠️ (incorrect - this is a state name)
- **City:** `Murphy`
- **State:** `Texas`
- **ZIP Code:** `75094`

### For Smarty API, this should be formatted as:

```json
{
  "address1": "08 W Farm To Market 544 #107",
  "address2": "743",
  "city": "Murphy",
  "state": "TX",
  "zip5": "75094"
}
```

**OR** (if combining Apt with Address1):

```json
{
  "address1": "08 W Farm To Market 544 #107 #743",
  "address2": "",
  "city": "Murphy",
  "state": "TX",
  "zip5": "75094"
}
```

---

## 🔧 How It Works Now

The updated `formatAddressForSmarty` function now:

1. **Prioritizes Address1** over Street field
   - Uses `resAddress1` if it has content
   - Falls back to `resStreet` only if Address1 is empty
   - This fixes the issue where Street has "Alabama" (wrong data)

2. **Handles Apt. No properly:**
   - If Address1 already contains unit info (#107), Apt. No goes to Address2
   - If Address1 has no unit info, Apt. No is appended to Address1
   - Format: `Address1 #AptNo`

3. **Combines Address2 and Apt. No:**
   - If both exist, combines them: `Apt, Address2`
   - If only Apt exists, uses it as Address2

---

## 📝 Example Scenarios

### Scenario 1: Your Current Data
```
Apt. No: 743
Address 1: 08 W Farm To Market 544 #107
Address 2: (empty)
Street: Alabama
City: Murphy
State: Texas
ZIP: 75094
```

**Formatted for Smarty:**
```json
{
  "address1": "08 W Farm To Market 544 #107",
  "address2": "743",
  "city": "Murphy",
  "state": "TX",
  "zip5": "75094"
}
```

### Scenario 2: Address1 without Unit
```
Apt. No: 743
Address 1: 08 W Farm To Market 544
Address 2: (empty)
City: Murphy
State: Texas
ZIP: 75094
```

**Formatted for Smarty:**
```json
{
  "address1": "08 W Farm To Market 544 #743",
  "address2": "",
  "city": "Murphy",
  "state": "TX",
  "zip5": "75094"
}
```

### Scenario 3: Both Address2 and Apt. No
```
Apt. No: 743
Address 1: 08 W Farm To Market 544
Address 2: Building A
City: Murphy
State: Texas
ZIP: 75094
```

**Formatted for Smarty:**
```json
{
  "address1": "08 W Farm To Market 544",
  "address2": "743, Building A",
  "city": "Murphy",
  "state": "TX",
  "zip5": "75094"
}
```

---

## ⚠️ Important Notes

1. **Street Field Issue:**
   - Your "Street" field contains "Alabama" which is incorrect
   - The system now prioritizes "Address 1" over "Street"
   - Consider clearing or fixing the Street field in your form

2. **Apt. No Handling:**
   - Apt. No is now properly combined with the address
   - If Address1 has unit info (#107), Apt goes to Address2
   - If Address1 has no unit, Apt is appended to Address1

3. **State Format:**
   - Full state names are automatically converted to 2-letter codes
   - "Texas" → "TX"
   - "Alabama" → "AL"

---

## 🧪 Testing Your Address

To test with your current data:

```javascript
const testAddress = {
  resApt: "743",
  resAddress1: "08 W Farm To Market 544 #107",
  resAddress2: "",
  resStreet: "Alabama", // Will be ignored (Address1 takes priority)
  resCity: "Murphy",
  resState: "Texas",
  resZip: "75094"
};

const formatted = formatAddressForSmarty(testAddress, 'res');
// Result:
// {
//   address1: "08 W Farm To Market 544 #107",
//   address2: "743",
//   city: "Murphy",
//   state: "TX",
//   zip5: "75094"
// }
```

---

## ✅ The Fix

I've updated the `formatAddressForSmarty` function to:
- ✅ Prioritize Address1 over Street (fixes "Alabama" issue)
- ✅ Properly handle Apt. No
- ✅ Combine Address2 and Apt. No when both exist
- ✅ Detect if Address1 already has unit info

**Your address should now validate correctly!**

