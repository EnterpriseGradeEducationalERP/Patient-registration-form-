# ⚡ Quick Deployment Guide - Hostinger hPanel

This is a condensed version of the full deployment guide. For detailed instructions, see `HOSTINGER_DEPLOYMENT_GUIDE.md`.

---

## 🚀 Quick Steps

### 1. Build Your Project
```bash
npm install
npm run build
```

### 2. Set Up MongoDB Atlas (5 minutes)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create cluster (M0 Free)
3. Create database user (save credentials!)
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Get connection string → Replace `<password>` and add database name

### 3. Upload Files to Hostinger

**Folder Structure:**
```
public_html/
├── api/
│   ├── server.cjs
│   ├── server/
│   ├── package.json
│   └── .env
├── dist/ (or root)
│   ├── index.html
│   └── assets/
└── .htaccess
```

**Upload:**
- Backend: `server.cjs`, `server/`, `package.json` → `api/` folder
- Frontend: `dist/` contents → `public_html/` root
- Config: `.htaccess` → `public_html/` root

### 4. Create .env File on Server

In `api/` folder, create `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority
SMARTY_AUTH_ID=your-id
SMARTY_AUTH_TOKEN=your-token
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=production
PORT=3000
VITE_API_URL=https://yourdomain.com/api
FRONTEND_URL=https://yourdomain.com
```

### 5. Install Dependencies & Start Node.js App

**Via SSH:**
```bash
cd public_html/api
npm install --production
```

**Via hPanel:**
1. Advanced → Node.js → Create Application
2. Application Root: `/api`
3. Startup File: `server.cjs`
4. Add environment variables
5. Start application

### 6. Configure Domain & SSL

1. SSL → Install SSL (Let's Encrypt)
2. Test: `https://yourdomain.com`

---

## ✅ Quick Test

1. **Backend:** `https://yourdomain.com/api/health`
2. **Frontend:** `https://yourdomain.com`
3. **Test Registration:** Submit a test patient

---

## 🆘 Common Issues

**Node.js won't start:**
- Check logs in Node.js Manager
- Verify `server.cjs` path
- Check environment variables

**MongoDB connection failed:**
- Verify connection string
- Check network access in Atlas
- Test connection locally first

**Frontend can't reach API:**
- Check `VITE_API_URL` in build
- Verify CORS settings
- Check API endpoint is accessible

---

## 📚 Full Documentation

- **Complete Guide:** `HOSTINGER_DEPLOYMENT_GUIDE.md`
- **MongoDB Setup:** `MONGODB_SETUP_GUIDE.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`

---

**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate

