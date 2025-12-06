# 🚀 START HERE - Complete Deployment Guide
## Subdomain: https://nghc.nextgenproductlabs.com/

---

## 📋 What You Need

1. ✅ Subdomain created: `nghc.nextgenproductlabs.com`
2. ✅ FTP credentials (provided below)
3. ✅ MongoDB connection string
4. ✅ Gmail app password (if using email)

---

## ⚡ Quick Start (8 Minutes)

**For fastest deployment, follow:** `QUICK_START_DEPLOYMENT.md`

---

## 📚 Complete Step-by-Step Guide

**For detailed instructions, follow:** `COMPLETE_DEPLOYMENT_GUIDE.md`

---

## ✅ Deployment Checklist

**Use this to track progress:** `DEPLOYMENT_CHECKLIST_SUBDOMAIN.md`

---

## 🔧 FTP Connection Details

```
Host: ftp://82.180.140.60
Username: u475081356.nghc.nextgenproductlabs.com
Password: 996699@Admin
Port: 21
Folder: public_html/
```

---

## 🎯 Critical Configuration

### Node.js Application Settings (hPanel)

| Setting | Value |
|--------|-------|
| **Application Root** | `/api` or `/public_html/api` |
| **Application URL** | `nghc.nextgenproductlabs.com/api` ⚠️ **MUST include /api** |
| **Startup File** | `server.cjs` |
| **Port** | `3000` |

**⚠️ IMPORTANT:** Application URL MUST include `/api` or you'll get 404 errors!

---

## 📁 File Structure After Deployment

```
public_html/
├── index.html          (from dist/)
├── assets/             (from dist/assets/)
├── favicon.ico         (from dist/)
├── .htaccess           (Apache config)
├── test-api-connection.html  (for testing)
└── api/                (Backend)
    ├── server.cjs
    ├── package.json
    ├── .env            (create this)
    └── server/
        └── services/
```

---

## 🔍 Testing After Deployment

1. **Frontend:** `https://nghc.nextgenproductlabs.com/`
2. **API Health:** `https://nghc.nextgenproductlabs.com/api/health`
3. **Test Page:** `https://nghc.nextgenproductlabs.com/test-api-connection.html`

---

## 🐛 Common Issues & Fixes

### Issue: API Returns 404 "This Page Does Not Exist"

**Fix:**
1. Go to hPanel → Node.js Manager
2. Check **Application URL** = `nghc.nextgenproductlabs.com/api` (must include `/api`)
3. Check **Application Root** = `/api` or `/public_html/api`
4. Check Status = **Running**
5. Restart Node.js application

### Issue: Frontend Doesn't Load

**Fix:**
1. Verify `index.html` in `public_html/` root
2. Verify `assets/` folder exists
3. Check browser console (F12) for errors

### Issue: MongoDB Connection Failed

**Fix:**
1. Verify MongoDB connection string in `.env`
2. Check MongoDB is accessible from Hostinger
3. Check Node.js logs for errors

---

## 📞 Need Help?

1. Check `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed steps
2. Check `FIX_404_ERROR.md` for API routing issues
3. Review Node.js logs in hPanel
4. Test API directly: `https://nghc.nextgenproductlabs.com/api/health`

---

## ✅ Success Indicators

- ✅ Frontend loads at: `https://nghc.nextgenproductlabs.com/`
- ✅ API health check works: `https://nghc.nextgenproductlabs.com/api/health`
- ✅ Address verification works
- ✅ Form submission works
- ✅ No 404 errors
- ✅ All API calls return JSON (not HTML)

---

## 📝 Next Steps

1. Read `QUICK_START_DEPLOYMENT.md` for fast deployment
2. OR read `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed steps
3. Use `DEPLOYMENT_CHECKLIST_SUBDOMAIN.md` to track progress
4. Deploy and test!

---

**Ready to deploy? Start with `QUICK_START_DEPLOYMENT.md`!**

