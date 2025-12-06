# 🗄️ MongoDB Setup Guide for Hostinger Deployment

This guide covers setting up MongoDB for your Patient Registration System on Hostinger.

---

## Option 1: MongoDB Atlas (Recommended - Free Tier Available)

MongoDB Atlas is the recommended solution as it's:
- ✅ Free tier available (512MB storage)
- ✅ Fully managed (no server maintenance)
- ✅ Automatic backups
- ✅ Easy to scale
- ✅ Works perfectly with Hostinger

### Step 1: Create MongoDB Atlas Account

1. **Sign Up:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Click **"Try Free"** or **"Sign Up"**
   - Create account (can use Google/GitHub)

2. **Verify Email:**
   - Check your email
   - Click verification link

### Step 2: Create a Cluster

1. **Select Cloud Provider:**
   - Choose **AWS**, **Google Cloud**, or **Azure**
   - Select region closest to your Hostinger server
   - Click **"Create Cluster"**

2. **Choose Tier:**
   - **M0 Sandbox (Free)** - Perfect for development/small apps
   - 512MB storage, shared RAM/CPU
   - No credit card required

3. **Configure Cluster:**
   - Cluster name: `patient-registration-cluster` (or any name)
   - Click **"Create Cluster"**
   - Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User

1. **Access Database Access:**
   - In Atlas dashboard, go to **Security** → **Database Access**
   - Click **"Add New Database User"**

2. **Configure User:**
   - **Authentication Method:** Password
   - **Username:** `nhs_admin` (or your choice)
   - **Password:** Generate secure password (save it!)
   - **Database User Privileges:** 
     - Select **"Read and write to any database"**
   - Click **"Add User"**

3. **Save Credentials:**
   - Username: `nhs_admin`
   - Password: `[your-generated-password]`
   - ⚠️ **Save these - you'll need them!**

### Step 4: Configure Network Access

1. **Access Network Access:**
   - Go to **Security** → **Network Access**
   - Click **"Add IP Address"**

2. **Allow Access:**
   - **Option A (Easiest):** Click **"Allow Access from Anywhere"**
     - IP Address: `0.0.0.0/0`
     - Description: "Allow from anywhere"
   - **Option B (More Secure):** Add Hostinger server IP
     - Get your Hostinger server IP from hPanel
     - Add IP: `xxx.xxx.xxx.xxx/32`
   - Click **"Confirm"**

### Step 5: Get Connection String

1. **Access Clusters:**
   - Go to **Clusters** in left sidebar
   - Click **"Connect"** button on your cluster

2. **Choose Connection Method:**
   - Select **"Connect your application"**

3. **Get Connection String:**
   - Driver: **Node.js**
   - Version: **5.5 or later**
   - Copy the connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

4. **Update Connection String:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name: `NHS_NPMS`
   - Final format:
     ```
     mongodb+srv://nhs_admin:your-password@cluster0.xxxxx.mongodb.net/NHS_NPMS?retryWrites=true&w=majority
     ```

### Step 6: Test Connection

1. **Update .env File:**
   ```env
   MONGODB_URI=mongodb+srv://nhs_admin:your-password@cluster0.xxxxx.mongodb.net/NHS_NPMS?retryWrites=true&w=majority
   ```

2. **Test Locally:**
   ```bash
   node test-mongodb-connection.cjs
   ```

3. **Expected Output:**
   ```
   ✅ MongoDB Connected Successfully!
      Host: cluster0.xxxxx.mongodb.net
      Database: NHS_NPMS
   ```

---

## Option 2: Hostinger MongoDB (If Available)

Some Hostinger plans include MongoDB. Check if your plan includes it.

### Step 1: Access MongoDB in hPanel

1. **Login to hPanel:**
   - Go to your Hostinger account
   - Access hPanel

2. **Find MongoDB:**
   - Look for **"Databases"** → **"MongoDB"**
   - Or **"Advanced"** → **"MongoDB"**

### Step 2: Create Database

1. **Create Database:**
   - Click **"Create Database"**
   - Database name: `NHS_NPMS`
   - Click **"Create"**

2. **Create User:**
   - Username: `nhs_user` (or your choice)
   - Password: Generate secure password
   - Save credentials!

### Step 3: Get Connection String

1. **Connection Details:**
   - Host: Usually `localhost` or provided hostname
   - Port: Usually `27017`
   - Database: `NHS_NPMS`
   - Username: `nhs_user`
   - Password: `[your-password]`

2. **Connection String Format:**
   ```
   mongodb://nhs_user:your-password@host:27017/NHS_NPMS
   ```

### Step 4: Update .env

```env
MONGODB_URI=mongodb://nhs_user:your-password@host:27017/NHS_NPMS
```

---

## Option 3: Self-Hosted MongoDB (Advanced)

If you have VPS hosting, you can install MongoDB yourself.

### Installation (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update packages
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database user
mongosh
use NHS_NPMS
db.createUser({
  user: "nhs_admin",
  pwd: "your-secure-password",
  roles: [{ role: "readWrite", db: "NHS_NPMS" }]
})
```

---

## 🔧 Connection String Formats

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS?retryWrites=true&w=majority
```

### Standard MongoDB (Local/Remote)
```
mongodb://username:password@host:port/NHS_NPMS
```

### MongoDB with Authentication
```
mongodb://username:password@host:port/NHS_NPMS?authSource=admin
```

---

## ✅ Testing Your Connection

### Method 1: Using Test Script

```bash
node test-mongodb-connection.cjs
```

### Method 2: Using MongoDB Compass (GUI)

1. **Download MongoDB Compass:**
   - [mongodb.com/products/compass](https://www.mongodb.com/products/compass)

2. **Connect:**
   - Paste your connection string
   - Click **"Connect"**

3. **Verify:**
   - Should see `NHS_NPMS` database
   - Collections will be created automatically when first patient is registered

### Method 3: Using Server Logs

When your server starts, you should see:
```
🗄️ MongoDB Connected: cluster0.xxxxx.mongodb.net
📊 Database: NHS_NPMS
```

---

## 🔒 Security Best Practices

1. **Use Strong Passwords:**
   - Minimum 16 characters
   - Mix of letters, numbers, symbols

2. **Restrict Network Access:**
   - Only allow IPs that need access
   - Use IP whitelist in MongoDB Atlas

3. **Use Environment Variables:**
   - Never hardcode credentials
   - Use `.env` file (not committed to Git)

4. **Regular Backups:**
   - MongoDB Atlas: Automatic backups
   - Self-hosted: Set up regular backups

5. **Monitor Access:**
   - Review access logs regularly
   - Set up alerts for suspicious activity

---

## 🐛 Troubleshooting

### Issue: Connection Timeout

**Solutions:**
- Check network access settings in MongoDB Atlas
- Verify IP whitelist includes your server IP
- Check firewall settings
- Verify connection string is correct

### Issue: Authentication Failed

**Solutions:**
- Verify username and password are correct
- Check if user has proper permissions
- Ensure database name is correct
- Try resetting password

### Issue: Database Not Found

**Solutions:**
- Database will be created automatically on first connection
- Verify connection string includes database name
- Check if user has permission to create databases

### Issue: SSL/TLS Error

**Solutions:**
- MongoDB Atlas requires SSL
- Add `?ssl=true` to connection string (if needed)
- For local MongoDB, SSL may not be required

---

## 📊 Database Structure

Your database will have:

**Collection:** `NPMS_PATIENT_DETAILS`
- Contains all patient registration data
- Automatically created on first patient registration
- Indexed on: `NPMS_PATIENTID`, `NPMS_PATIENT_SSN`

**Indexes:**
- Unique index on: `NPMS_PATIENTID`
- Unique index on: `NPMS_PATIENT_SSN`
- Compound unique index on: `NPMS_PATIENT_FIRSTNAME`, `NPMS_PATIENT_LASTNAME`, `NPMS_PATIENT_DATEOFBIRTH`, `NPMS_PATIENT_SSN`

---

## 💾 Backup & Restore

### MongoDB Atlas (Automatic)
- Backups are automatic
- Can restore from any point in time
- Access via Atlas dashboard → **Backups**

### Manual Backup
```bash
# Backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS" --out=/backup

# Restore
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/NHS_NPMS" /backup/NHS_NPMS
```

---

## ✅ Next Steps

After MongoDB is set up:
1. ✅ Update `.env` file with connection string
2. ✅ Test connection locally
3. ✅ Deploy to Hostinger
4. ✅ Verify connection in production
5. ✅ Test patient registration

---

**Recommended:** Use MongoDB Atlas for easiest setup and automatic backups!

