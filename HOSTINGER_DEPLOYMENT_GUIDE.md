# 🚀 Hostinger hPanel Deployment Guide
## Patient Registration System - Complete Deployment Instructions

This guide will walk you through deploying your React + Node.js + MongoDB application to Hostinger's hPanel.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Project](#step-1-prepare-your-project)
3. [Step 2: Set Up MongoDB Database](#step-2-set-up-mongodb-database)
4. [Step 3: Upload Files to Hostinger](#step-3-upload-files-to-hostinger)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Set Up Node.js Application](#step-5-set-up-nodejs-application)
7. [Step 6: Configure Domain & SSL](#step-6-configure-domain--ssl)
8. [Step 7: Test Your Deployment](#step-7-test-your-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- ✅ Hostinger hosting account with Node.js support
- ✅ Access to hPanel
- ✅ Domain name configured
- ✅ MongoDB Atlas account (recommended) OR MongoDB database from Hostinger
- ✅ FTP/File Manager access
- ✅ SSH access (if available)

---

## Step 1: Prepare Your Project

### 1.1 Build Your React Application

On your local machine, run:

```bash
npm install
npm run build
```

This creates a `dist` folder with production-ready files.

### 1.2 Prepare Server Files

Ensure these files are ready:
- ✅ `server.cjs` - Your Express server
- ✅ `server/` folder - Service files
- ✅ `package.json` - Dependencies
- ✅ `.env.production` - Production environment variables (create this)

### 1.3 Create Production Environment File

Create `.env.production` file in your project root:

```env
# MongoDB Connection (Use MongoDB Atlas or Hostinger MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API
SMARTY_AUTH_ID=your-smarty-auth-id
SMARTY_AUTH_TOKEN=your-smarty-auth-token

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server Configuration
NODE_ENV=production
PORT=3000

# Frontend API URL (Update with your domain)
VITE_API_URL=https://yourdomain.com/api
```

---

## Step 2: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended - Free Tier Available)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new cluster (Free tier: M0)

2. **Configure Database Access**
   - Go to **Database Access** → **Add New Database User**
   - Create username and password (save these!)
   - Set privileges: **Read and write to any database**

3. **Configure Network Access**
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add your Hostinger server IP

4. **Get Connection String**
   - Go to **Clusters** → **Connect** → **Connect your application**
   - Copy connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `NHS_NPMS`
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority`

### Option B: Hostinger MongoDB (If Available)

1. **Access hPanel**
   - Login to Hostinger hPanel
   - Navigate to **Databases** → **MongoDB**

2. **Create MongoDB Database**
   - Click **Create Database**
   - Set database name: `NHS_NPMS`
   - Create user and password
   - Note the connection details

3. **Get Connection String**
   - Format: `mongodb://username:password@host:port/NHS_NPMS`
   - Use the connection details provided by Hostinger

---

## Step 3: Upload Files to Hostinger

### 3.1 Access File Manager

1. Login to **hPanel**
2. Go to **Files** → **File Manager**
3. Navigate to your domain's root directory (usually `public_html` or `domains/yourdomain.com/public_html`)

### 3.2 Upload Project Files

**Create the following folder structure:**

```
public_html/
├── api/              (Backend - Node.js)
│   ├── server.cjs
│   ├── server/
│   ├── package.json
│   ├── .env
│   └── node_modules/ (will be installed on server)
└── dist/             (Frontend - React build)
    ├── index.html
    ├── assets/
    └── ...
```

**Upload Process:**

1. **Upload Backend Files:**
   - Create folder: `api/`
   - Upload: `server.cjs`, `server/` folder, `package.json`
   - Upload `.env.production` as `.env`

2. **Upload Frontend Files:**
   - Upload entire `dist/` folder contents to `public_html/`
   - Or create `dist/` folder and upload there

3. **Upload Configuration Files:**
   - Upload `.htaccess` (for Apache configuration)
   - Upload `package.json` to `api/` folder

---

## Step 4: Configure Environment Variables

### 4.1 Create .env File on Server

1. In **File Manager**, navigate to `api/` folder
2. Create new file: `.env`
3. Copy content from `.env.production` and update:
   - MongoDB connection string
   - API credentials
   - Your domain URL

### 4.2 Set File Permissions

- `.env` file: **644** (readable by server)
- `server.cjs`: **755** (executable)

---

## Step 5: Set Up Node.js Application

### 5.1 Install Node.js Dependencies

**Option A: Using SSH (Recommended)**

1. **Enable SSH in hPanel:**
   - Go to **Advanced** → **SSH Access**
   - Enable SSH if not already enabled
   - Note your SSH credentials

2. **Connect via SSH:**
   ```bash
   ssh username@yourdomain.com
   # Or use the IP provided by Hostinger
   ```

3. **Navigate to API folder:**
   ```bash
   cd public_html/api
   # Or: cd domains/yourdomain.com/public_html/api
   ```

4. **Install dependencies:**
   ```bash
   npm install --production
   ```

**Option B: Using Terminal in hPanel**

1. Go to **Advanced** → **Terminal**
2. Navigate to `api/` folder
3. Run: `npm install --production`

### 5.2 Set Up Node.js Application in hPanel

1. **Access Node.js Manager:**
   - Go to **Advanced** → **Node.js** (or **Node.js Selector**)

2. **Create Node.js Application:**
   - Click **Create Application**
   - **Application Name:** `patient-registration-api`
   - **Node.js Version:** Select latest LTS (18.x or 20.x)
   - **Application Root:** `/api` or `/public_html/api`
   - **Application URL:** `yourdomain.com/api` (or subdomain)
   - **Application Startup File:** `server.cjs`
   - **Port:** `3000` (or auto-assigned port)

3. **Configure Environment Variables:**
   - In Node.js Manager, find **Environment Variables** section
   - Add all variables from your `.env` file:
     - `MONGODB_URI`
     - `SMARTY_AUTH_ID`
     - `SMARTY_AUTH_TOKEN`
     - `EMAIL_USER`
     - `EMAIL_PASSWORD`
     - `NODE_ENV=production`
     - `PORT=3000`

4. **Start Application:**
   - Click **Start** or **Restart** application
   - Check logs for any errors

---

## Step 6: Configure Domain & SSL

### 6.1 Set Up Domain Routing

**Option A: Subdomain for API (Recommended)**

1. **Create Subdomain:**
   - Go to **Domains** → **Subdomains**
   - Create: `api.yourdomain.com`
   - Point to: `public_html/api`

2. **Update Frontend API URL:**
   - In `.env` file, set: `VITE_API_URL=https://api.yourdomain.com`
   - Rebuild frontend: `npm run build`
   - Re-upload `dist/` folder

**Option B: Same Domain with Path**

- API: `yourdomain.com/api`
- Frontend: `yourdomain.com/`
- Configure `.htaccess` for routing (see below)

### 6.2 Configure .htaccess for Frontend

The `.htaccess` file should be in `public_html/` root:

```apache
# React Router - Handle client-side routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API calls
  RewriteCond %{REQUEST_URI} !^/api
  
  # Rewrite everything else to index.html
  RewriteRule . /index.html [L]
</IfModule>

# Enable CORS for API (if needed)
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### 6.3 Enable SSL Certificate

1. **Access SSL Manager:**
   - Go to **SSL** in hPanel
   - Select your domain

2. **Install Free SSL:**
   - Click **Install SSL** (Let's Encrypt)
   - Wait for installation (usually automatic)
   - Force HTTPS redirect if needed

3. **Update API URLs:**
   - Ensure all API calls use `https://`
   - Update `VITE_API_URL` in frontend build

---

## Step 7: Test Your Deployment

### 7.1 Test Backend API

1. **Check API Health:**
   ```
   https://api.yourdomain.com/api/patients
   # Or: https://yourdomain.com/api/patients
   ```

2. **Test Patient Registration:**
   - Use Postman or browser console
   - POST to: `https://api.yourdomain.com/api/register-patient`

3. **Check Server Logs:**
   - In Node.js Manager → **View Logs**
   - Look for MongoDB connection success
   - Check for any errors

### 7.2 Test Frontend

1. **Visit Your Domain:**
   ```
   https://yourdomain.com
   ```

2. **Test Features:**
   - ✅ Page loads correctly
   - ✅ API calls work (check browser console)
   - ✅ Form submission works
   - ✅ Address verification works
   - ✅ Pharmacy search works

### 7.3 Test Database Connection

1. **Check MongoDB Connection:**
   - Look at server logs
   - Should see: `🗄️ MongoDB Connected`

2. **Test Database Operations:**
   - Submit a test patient registration
   - Check if data is saved
   - Verify email is sent (if configured)

---

## Troubleshooting

### Issue: Node.js Application Won't Start

**Solutions:**
- Check Node.js version compatibility
- Verify `server.cjs` is in correct location
- Check file permissions (755 for server.cjs)
- Review error logs in Node.js Manager
- Ensure all dependencies are installed

### Issue: MongoDB Connection Failed

**Solutions:**
- Verify MongoDB connection string in `.env`
- Check MongoDB Atlas network access (allow all IPs)
- Verify database credentials
- Test connection string locally first
- Check firewall settings

### Issue: Frontend Can't Connect to API

**Solutions:**
- Verify `VITE_API_URL` in frontend build
- Check CORS settings in `server.cjs`
- Verify API endpoint is accessible
- Check browser console for errors
- Ensure API subdomain/route is configured correctly

### Issue: 404 Errors on Page Refresh

**Solutions:**
- Verify `.htaccess` file is in root directory
- Check mod_rewrite is enabled
- Ensure React Router paths are configured
- Test `.htaccess` rules

### Issue: Environment Variables Not Loading

**Solutions:**
- Verify `.env` file exists in `api/` folder
- Check file permissions (644)
- Add variables in Node.js Manager as well
- Restart Node.js application after changes

### Issue: Email Not Sending

**Solutions:**
- Verify Gmail App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`
- Test email endpoint: `/api/test-email`
- Check server logs for email errors

---

## 📝 Post-Deployment Checklist

- [ ] MongoDB database connected and working
- [ ] Node.js application running without errors
- [ ] Frontend loads correctly
- [ ] API endpoints accessible
- [ ] SSL certificate installed and working
- [ ] Patient registration form works
- [ ] Address verification works
- [ ] Pharmacy search works
- [ ] Email notifications working
- [ ] Database saves patient data correctly
- [ ] All environment variables configured
- [ ] Error logging working
- [ ] Performance is acceptable

---

## 🔧 Maintenance

### Updating Your Application

1. **Update Code:**
   - Make changes locally
   - Test locally
   - Build frontend: `npm run build`

2. **Upload Changes:**
   - Upload updated files via File Manager or FTP
   - Restart Node.js application in hPanel

3. **Update Dependencies:**
   ```bash
   cd api
   npm install
   npm update
   ```

### Monitoring

- **Check Logs Regularly:**
  - Node.js Manager → View Logs
  - Monitor for errors
  - Check MongoDB connection status

- **Database Maintenance:**
  - Regular backups (MongoDB Atlas does this automatically)
  - Monitor database size
  - Check for slow queries

---

## 📞 Support

If you encounter issues:
1. Check server logs in Node.js Manager
2. Review browser console for frontend errors
3. Verify all environment variables
4. Test API endpoints individually
5. Contact Hostinger support if server issues persist

---

## 🎉 Success!

Your Patient Registration System should now be live on Hostinger!

**Your Application URLs:**
- Frontend: `https://yourdomain.com`
- API: `https://api.yourdomain.com` (or `https://yourdomain.com/api`)

**Next Steps:**
- Set up regular backups
- Monitor application performance
- Configure custom domain email (optional)
- Set up monitoring/analytics (optional)

---

**Last Updated:** 2024
**Version:** 1.0

