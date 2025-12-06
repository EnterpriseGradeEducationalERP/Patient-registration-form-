# 🚀 Hostinger Deployment Instructions

## 📦 What's Included

This deployment package contains:
- ✅ **Pre-built frontend** (React application)
- ✅ **Backend server** (Node.js/Express)
- ✅ **Pre-installed dependencies** (node_modules included)
- ✅ **Configuration files** (.htaccess, package.json)
- ✅ **Environment template** (.env.example)

---

## 📁 Folder Structure

```
deploy/
├── api/                    # Backend - Upload to public_html/api/
│   ├── server.cjs
│   ├── server/
│   ├── package.json
│   ├── node_modules/       # ✅ Pre-installed!
│   └── .env.example
│
└── public_html/            # Frontend - Upload to public_html/
    ├── index.html
    ├── assets/
    └── .htaccess
```

---

## 🎯 Step-by-Step Deployment

### Step 1: Set Up MongoDB Database

1. **Create MongoDB Atlas Account** (Free tier available)
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up and create a free cluster (M0)
   - Create database user
   - Configure network access (allow all IPs: 0.0.0.0/0)
   - Get connection string

2. **Connection String Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority
   ```

---

### Step 2: Upload Files to Hostinger

#### Option A: Using File Manager (Recommended)

1. **Login to hPanel**
2. **Go to:** Files → File Manager
3. **Navigate to:** `public_html/` (your domain root)

4. **Upload Backend:**
   - Create folder: `api/` (if doesn't exist)
   - Upload all files from `deploy/api/` to `public_html/api/`
   - Include: `server.cjs`, `server/` folder, `package.json`, `node_modules/`

5. **Upload Frontend:**
   - Upload all contents from `deploy/public_html/` to `public_html/` root
   - This includes: `index.html`, `assets/` folder, `.htaccess`

#### Option B: Using FTP

1. **Connect via FTP client** (FileZilla, WinSCP, etc.)
2. **Upload `api/` folder** to: `/public_html/api/`
3. **Upload `public_html/` contents** to: `/public_html/`

---

### Step 3: Create Environment Variables File

1. **In File Manager**, navigate to: `public_html/api/`
2. **Create new file:** `.env`
3. **Copy content from:** `api/.env.example`
4. **Update with your values:**

```env
# MongoDB (from Step 1)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API
SMARTY_AUTH_ID=your-smarty-auth-id
SMARTY_AUTH_TOKEN=your-smarty-auth-token

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server
NODE_ENV=production
PORT=3000

# Your Domain (UPDATE THESE!)
VITE_API_URL=https://yourdomain.com/api
FRONTEND_URL=https://yourdomain.com
```

**⚠️ IMPORTANT:** Replace `yourdomain.com` with your actual domain!

---

### Step 4: Set Up Node.js Application

1. **Access Node.js Manager:**
   - Go to: **Advanced** → **Node.js** (or **Node.js Selector**)

2. **Create Application:**
   - Click **"Create Application"** or **"Add Application"**
   - **Application Name:** `patient-registration-api`
   - **Node.js Version:** Select latest LTS (18.x or 20.x)
   - **Application Root:** `/api` or `/public_html/api`
   - **Application Startup File:** `server.cjs`
   - **Port:** `3000` (or leave auto-assigned)

3. **Add Environment Variables:**
   - In Node.js Manager, find **"Environment Variables"** section
   - Add each variable from your `.env` file:
     - `MONGODB_URI`
     - `SMARTY_AUTH_ID`
     - `SMARTY_AUTH_TOKEN`
     - `EMAIL_USER`
     - `EMAIL_PASSWORD`
     - `NODE_ENV=production`
     - `PORT=3000`
     - `VITE_API_URL`
     - `FRONTEND_URL`

4. **Start Application:**
   - Click **"Start"** or **"Restart"**
   - Check **"Logs"** for any errors
   - Should see: `🚀 Server running on port 3000`

---

### Step 5: Configure SSL Certificate

1. **Access SSL Manager:**
   - Go to: **SSL** in hPanel

2. **Install SSL:**
   - Select your domain
   - Click **"Install SSL"** (Let's Encrypt - Free)
   - Wait for installation (usually automatic)

3. **Force HTTPS:**
   - Enable **"Force HTTPS"** if available
   - Or configure in `.htaccess` (already included)

---

### Step 6: Test Your Deployment

1. **Test Frontend:**
   ```
   https://yourdomain.com
   ```
   - Should load the patient registration form

2. **Test API Health:**
   ```
   https://yourdomain.com/api/health
   ```
   - Should return: `{"status":"ok",...}`

3. **Test Patient Registration:**
   - Fill out the form
   - Submit patient data
   - Verify success message
   - Check MongoDB for saved data

---

## ✅ Verification Checklist

- [ ] MongoDB database connected (check server logs)
- [ ] Node.js application running (no errors in logs)
- [ ] Frontend loads correctly
- [ ] API endpoints accessible
- [ ] SSL certificate installed
- [ ] Patient registration form works
- [ ] Data saves to MongoDB
- [ ] Email notifications work (if configured)

---

## 🆘 Troubleshooting

### Node.js Won't Start
- ✅ Check logs in Node.js Manager
- ✅ Verify `server.cjs` path is correct
- ✅ Check environment variables are set
- ✅ Verify file permissions (755 for server.cjs)

### MongoDB Connection Failed
- ✅ Verify connection string in `.env`
- ✅ Check MongoDB Atlas network access (allow all IPs)
- ✅ Test connection string locally first
- ✅ Verify database credentials

### Frontend Can't Reach API
- ✅ Check `VITE_API_URL` in `.env` matches your domain
- ✅ Verify CORS settings in server.cjs
- ✅ Test API endpoint directly: `/api/health`
- ✅ Check browser console for errors

### 404 Errors on Page Refresh
- ✅ Verify `.htaccess` is in `public_html/` root
- ✅ Check mod_rewrite is enabled
- ✅ Test `.htaccess` rules

---

## 📝 Important Notes

1. **Dependencies are Pre-Installed:**
   - `node_modules/` folder is included
   - You don't need to run `npm install` on server
   - If needed, you can reinstall: `cd api && npm install --production`

2. **Environment Variables:**
   - Must create `.env` file on server
   - Also add variables in Node.js Manager
   - Update `VITE_API_URL` and `FRONTEND_URL` with your domain

3. **File Permissions:**
   - `.env` file: 644
   - `server.cjs`: 755
   - Folders: 755

4. **Domain Configuration:**
   - Update all URLs with your actual domain
   - Use `https://` (not `http://`)
   - Test SSL certificate is working

---

## 🎉 Success!

Once deployed, your application will be:
- ✅ Live at: `https://yourdomain.com`
- ✅ API at: `https://yourdomain.com/api`
- ✅ Connected to MongoDB
- ✅ Ready for patient registrations

---

## 📚 Additional Resources

For detailed documentation, see in project root:
- `HOSTINGER_DEPLOYMENT_GUIDE.md` - Complete guide
- `MONGODB_SETUP_GUIDE.md` - Database setup
- `DEPLOYMENT_CHECKLIST.md` - Verification checklist

---

**Need Help?** Check server logs, verify configurations, and review the troubleshooting section above.

**Good luck with your deployment! 🚀**

