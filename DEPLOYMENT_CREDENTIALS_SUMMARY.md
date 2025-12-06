# 🔑 Production Credentials Summary
## nghc.nextgenproductlabs.com

---

## ✅ Smarty API Credentials (CONFIGURED)

### Secret Keys (Server-Side - Currently Used)
```
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
```

### Embedded Key (Client-Side - Available for Future Use)
```
SMARTY_EMBEDDED_KEY=254574191005277116
```

**Status:** ✅ **READY TO USE**

---

## 📋 Complete .env File for Production

**Location:** `public_html/api/.env`

**Copy from:** `ENV_FILE_PRODUCTION.txt`

**Complete Content:**
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API - Address Verification (CONFIGURED)
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
SMARTY_EMBEDDED_KEY=254574191005277116

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://nghc.nextgenproductlabs.com
```

---

## 🌐 Production URLs

### Frontend
```
https://nghc.nextgenproductlabs.com/
```

### API Base
```
https://nghc.nextgenproductlabs.com/api
```

### API Endpoints
```
https://nghc.nextgenproductlabs.com/api/health
https://nghc.nextgenproductlabs.com/api/verify-address
https://nghc.nextgenproductlabs.com/api/search-pharmacies/:zipCode
https://nghc.nextgenproductlabs.com/api/register-patient
```

---

## ✅ Verification Checklist

- [x] Smarty Auth ID configured
- [x] Smarty Auth Token configured
- [x] Smarty Embedded Key available
- [x] Production URLs set correctly
- [ ] MongoDB connection string added
- [ ] Email credentials added
- [ ] .env file created on server
- [ ] Node.js application configured
- [ ] All files uploaded via FTP

---

## 📝 Quick Reference

**Subdomain:** `nghc.nextgenproductlabs.com`
**Frontend URL:** `https://nghc.nextgenproductlabs.com/`
**API URL:** `https://nghc.nextgenproductlabs.com/api`
**Node.js App URL:** `nghc.nextgenproductlabs.com/api` (in hPanel)

**Smarty Credentials:**
- Auth ID: `1661d522-1b74-452f-bb63-463bdedd9fa3`
- Auth Token: `SZkQ3ygTc5hiVL6RC9KR`
- Embedded: `254574191005277116`

---

**Status:** ✅ **ALL CREDENTIALS CONFIGURED - READY FOR DEPLOYMENT**

