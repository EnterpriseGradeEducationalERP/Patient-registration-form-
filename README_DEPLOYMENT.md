# 📦 Deployment Documentation

This folder contains all deployment-related documentation for the Patient Registration System.

---

## 📚 Documentation Files

### 1. **HOSTINGER_DEPLOYMENT_GUIDE.md** ⭐ START HERE
   - Complete step-by-step deployment guide
   - Detailed instructions for Hostinger hPanel
   - Covers all aspects: database, server, domain, SSL
   - **Read this first for full deployment**

### 2. **QUICK_DEPLOY.md** ⚡ Quick Reference
   - Condensed deployment steps
   - Fast reference guide
   - For experienced users
   - **Use this if you've deployed before**

### 3. **MONGODB_SETUP_GUIDE.md** 🗄️ Database Setup
   - MongoDB Atlas setup (recommended)
   - Hostinger MongoDB setup
   - Connection string configuration
   - Security best practices
   - **Read this for database setup**

### 4. **DEPLOYMENT_CHECKLIST.md** ✅ Checklist
   - Pre-deployment checklist
   - Step-by-step verification
   - Testing procedures
   - Post-deployment tasks
   - **Use this to ensure nothing is missed**

### 5. **env.production.template** 📝 Environment Template
   - Production environment variables template
   - Copy to `.env` on server
   - Update with your actual values

---

## 🚀 Quick Start

1. **Read:** `HOSTINGER_DEPLOYMENT_GUIDE.md`
2. **Set up MongoDB:** `MONGODB_SETUP_GUIDE.md`
3. **Follow checklist:** `DEPLOYMENT_CHECKLIST.md`
4. **Reference:** `QUICK_DEPLOY.md` for quick steps

---

## 📋 Deployment Overview

### What You'll Deploy:

1. **Frontend (React)**
   - Built with Vite
   - Static files in `dist/` folder
   - Served via Apache

2. **Backend (Node.js/Express)**
   - Express server (`server.cjs`)
   - API endpoints
   - MongoDB connection
   - Email service

3. **Database (MongoDB)**
   - MongoDB Atlas (recommended)
   - Or Hostinger MongoDB

### Requirements:

- ✅ Hostinger hosting with Node.js support
- ✅ MongoDB database (Atlas recommended)
- ✅ Domain name
- ✅ SSL certificate (free Let's Encrypt)
- ✅ API credentials (Smarty Streets, Email)

---

## 🔧 Configuration Files

### `.htaccess`
- Apache configuration
- React Router support
- Security headers
- Gzip compression
- Place in `public_html/` root

### `.env` (Production)
- Environment variables
- Database connection
- API credentials
- Server configuration
- Place in `api/` folder

### `server.cjs`
- Express server
- API endpoints
- MongoDB connection
- Email service
- Production-ready configuration

---

## 📁 Project Structure on Server

```
public_html/
├── api/                    # Backend (Node.js)
│   ├── server.cjs         # Express server
│   ├── server/            # Service files
│   │   ├── smartyService.cjs
│   │   └── pharmacyService.cjs
│   ├── package.json       # Dependencies
│   ├── .env              # Environment variables
│   └── node_modules/     # Installed dependencies
│
├── dist/                  # Frontend (React build)
│   ├── index.html
│   ├── assets/
│   │   ├── *.css
│   │   └── *.js
│   └── favicon.ico
│
└── .htaccess             # Apache configuration
```

---

## 🌐 URL Structure

### Option 1: Subdomain (Recommended)
- Frontend: `https://yourdomain.com`
- API: `https://api.yourdomain.com`

### Option 2: Same Domain
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com/api`

---

## 🔐 Environment Variables

Required variables in `.env`:

```env
# Database
MONGODB_URI=mongodb+srv://...

# APIs
SMARTY_AUTH_ID=...
SMARTY_AUTH_TOKEN=...

# Email
EMAIL_USER=...
EMAIL_PASSWORD=...

# Server
NODE_ENV=production
PORT=3000
VITE_API_URL=https://...
FRONTEND_URL=https://...
```

---

## ✅ Pre-Deployment Checklist

- [ ] Project builds successfully (`npm run build`)
- [ ] MongoDB database set up
- [ ] Environment variables prepared
- [ ] All API credentials ready
- [ ] Domain configured
- [ ] SSL certificate available

---

## 🧪 Testing After Deployment

1. **Health Check:**
   ```
   GET https://yourdomain.com/api/health
   ```

2. **Frontend:**
   ```
   https://yourdomain.com
   ```

3. **Test Registration:**
   - Fill out form
   - Submit patient data
   - Verify data saved to MongoDB
   - Check email sent (if configured)

---

## 🆘 Support & Troubleshooting

### Common Issues:

1. **Node.js won't start**
   - Check logs in Node.js Manager
   - Verify file paths
   - Check environment variables

2. **MongoDB connection failed**
   - Verify connection string
   - Check network access
   - Test connection locally

3. **Frontend can't reach API**
   - Check `VITE_API_URL`
   - Verify CORS settings
   - Check API endpoint

### Resources:

- Full deployment guide: `HOSTINGER_DEPLOYMENT_GUIDE.md`
- Troubleshooting section in main guide
- Hostinger support documentation
- MongoDB Atlas documentation

---

## 📞 Need Help?

1. Check the full deployment guide
2. Review troubleshooting section
3. Check server logs
4. Verify all configurations
5. Contact Hostinger support if server issues

---

## 🎉 Success!

Once deployed, your application will be:
- ✅ Accessible via your domain
- ✅ Secured with SSL
- ✅ Connected to MongoDB
- ✅ Ready for patient registrations

---

**Last Updated:** 2024
**Version:** 1.0

