# 🗄️ Database Connection Guide - Quick Setup

This guide will help you connect your Patient Registration System to MongoDB.

---

## 🚀 Option 1: MongoDB Atlas (Recommended - FREE)

MongoDB Atlas is the easiest and most reliable option. It's free for small applications.

### Step 1: Create MongoDB Atlas Account

1. **Go to:** https://www.mongodb.com/cloud/atlas
2. **Click:** "Try Free" or "Sign Up"
3. **Create account** (can use Google/GitHub login)
4. **Verify your email**

### Step 2: Create a Cluster

1. **After login, click "Build a Database"**
2. **Choose:** 
   - **M0 Sandbox (FREE)** - Perfect for your application
   - No credit card required!
3. **Select Cloud Provider:**
   - AWS, Google Cloud, or Azure
   - Choose region closest to your Hostinger server
4. **Cluster Name:** `patient-registration-cluster` (or any name)
5. **Click "Create Cluster"**
6. **Wait 3-5 minutes** for cluster to be created

### Step 3: Create Database User

1. **In Atlas dashboard, go to:** Security → Database Access
2. **Click:** "Add New Database User"
3. **Authentication Method:** Password
4. **Username:** `nhs_admin` (or your choice)
5. **Password:** 
   - Click "Autogenerate Secure Password" OR
   - Create your own strong password
   - **⚠️ SAVE THIS PASSWORD!** You'll need it!
6. **Database User Privileges:**
   - Select "Read and write to any database"
7. **Click "Add User"**

### Step 4: Configure Network Access

1. **Go to:** Security → Network Access
2. **Click:** "Add IP Address"
3. **Choose one:**
   - **Option A (Easiest):** Click "Allow Access from Anywhere"
     - IP Address: `0.0.0.0/0`
     - Description: "Allow from anywhere"
   - **Option B (More Secure):** Add your Hostinger server IP
     - Get IP from Hostinger hPanel
     - Add: `xxx.xxx.xxx.xxx/32`
4. **Click "Confirm"**

### Step 5: Get Connection String

1. **Go to:** Clusters (left sidebar)
2. **Click "Connect"** button on your cluster
3. **Select:** "Connect your application"
4. **Driver:** Node.js
5. **Version:** 5.5 or later
6. **Copy the connection string:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Connection String

**Replace the placeholders:**

1. **Replace `<username>`** with your database username (e.g., `nhs_admin`)
2. **Replace `<password>`** with your database password
3. **Add database name** after the `/`:
   ```
   mongodb+srv://nhs_admin:your-password@cluster0.xxxxx.mongodb.net/NHS_NPMS?retryWrites=true&w=majority
   ```

**Final format:**
```
mongodb+srv://nhs_admin:YourPassword123@cluster0.abc123.mongodb.net/NHS_NPMS?retryWrites=true&w=majority
```

### Step 7: Add to .env File

1. **On your Hostinger server:**
   - Go to `public_html/api/` folder
   - Open `.env` file (create if doesn't exist)

2. **Add this line:**
   ```env
   MONGODB_URI=mongodb+srv://nhs_admin:YourPassword123@cluster0.abc123.mongodb.net/NHS_NPMS?retryWrites=true&w=majority
   ```

3. **Replace with your actual connection string**

4. **Save the file**

### Step 8: Test Connection

1. **Restart your Node.js application** in hPanel
2. **Check logs** - should see:
   ```
   🗄️ MongoDB Connected: cluster0.xxxxx.mongodb.net
   📊 Database: NHS_NPMS
   ```

3. **Test API endpoint:**
   ```
   https://yourdomain.com/api/health
   ```
   Should show: `"mongodb": "connected"`

---

## 🔧 Option 2: Hostinger MongoDB (If Available)

Some Hostinger plans include MongoDB. Check if yours does:

1. **Login to hPanel**
2. **Go to:** Databases → MongoDB (or Advanced → MongoDB)
3. **If available:**
   - Create database: `NHS_NPMS`
   - Create user and password
   - Get connection string from Hostinger
   - Format: `mongodb://username:password@host:port/NHS_NPMS`

---

## 📝 Complete .env File Example

Your `.env` file in `public_html/api/` should look like this:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://nhs_admin:YourPassword123@cluster0.abc123.mongodb.net/NHS_NPMS?retryWrites=true&w=majority

# Smarty Streets API
SMARTY_AUTH_ID=your-smarty-auth-id
SMARTY_AUTH_TOKEN=your-smarty-auth-token

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server Configuration
NODE_ENV=production
PORT=3000

# Frontend API URL (Update with your domain!)
VITE_API_URL=https://yourdomain.com/api
FRONTEND_URL=https://yourdomain.com
```

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 Free tier)
- [ ] Database user created (username & password saved)
- [ ] Network access configured (0.0.0.0/0 or specific IP)
- [ ] Connection string obtained
- [ ] Connection string updated with username, password, and database name
- [ ] Added to .env file on server
- [ ] Node.js application restarted
- [ ] Connection verified in logs
- [ ] Health check endpoint shows "connected"

---

## 🐛 Troubleshooting

### Error: "MongoServerError: Authentication failed"

**Solution:**
- Verify username and password are correct
- Check for special characters in password (may need URL encoding)
- Ensure user has "Read and write" permissions

### Error: "MongoNetworkError: connection timeout"

**Solution:**
- Check network access in MongoDB Atlas
- Verify IP whitelist includes your server IP (or 0.0.0.0/0)
- Check firewall settings

### Error: "MongoParseError: Invalid connection string"

**Solution:**
- Verify connection string format
- Check for spaces or special characters
- Ensure database name is included: `/NHS_NPMS`
- Make sure password is URL-encoded if it has special characters

### Database Not Found

**Solution:**
- Database will be created automatically on first connection
- Verify connection string includes database name: `/NHS_NPMS`
- Check user has permission to create databases

---

## 🔒 Security Tips

1. **Use Strong Password:**
   - Minimum 16 characters
   - Mix of letters, numbers, symbols

2. **Restrict Network Access:**
   - Use specific IP instead of 0.0.0.0/0 if possible
   - Update IP whitelist regularly

3. **Never Commit .env:**
   - Keep .env file secure
   - Don't share connection string publicly

4. **Regular Backups:**
   - MongoDB Atlas provides automatic backups
   - Set up manual backups if needed

---

## 📊 Database Structure

Your database will have:

**Database Name:** `NHS_NPMS`

**Collection:** `NPMS_PATIENT_DETAILS`
- Created automatically on first patient registration
- Contains all patient data

**Indexes:**
- Unique index on `NPMS_PATIENTID`
- Unique index on `NPMS_PATIENT_SSN`
- Compound index for duplicate detection

---

## 🎯 Quick Reference

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Where to Add:**
- File: `public_html/api/.env`
- Variable: `MONGODB_URI`

**Test Connection:**
- Endpoint: `/api/health`
- Should show: `"mongodb": "connected"`

---

## 📞 Need Help?

1. **Check MongoDB Atlas Dashboard:**
   - Verify cluster is running
   - Check network access settings
   - Review connection string

2. **Check Server Logs:**
   - Node.js Manager → View Logs
   - Look for MongoDB connection messages

3. **Test Locally First:**
   - Test connection string on your local machine
   - Use MongoDB Compass (GUI tool)

---

**Once connected, your database is ready to store patient registrations! 🎉**

