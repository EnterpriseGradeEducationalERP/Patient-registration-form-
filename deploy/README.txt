================================================================================
  PATIENT REGISTRATION SYSTEM - HOSTINGER DEPLOYMENT PACKAGE
================================================================================

This folder contains all files ready for deployment to Hostinger hPanel.

FOLDER STRUCTURE:
-----------------
deploy/
├── api/                    # Backend (Node.js) - Upload to: public_html/api/
│   ├── server.cjs          # Express server
│   ├── server/             # Service files
│   ├── package.json        # Dependencies (already installed)
│   ├── node_modules/       # Pre-installed dependencies
│   └── .env.example        # Environment variables template
│
└── public_html/            # Frontend (React) - Upload to: public_html/
    ├── index.html
    ├── assets/
    └── .htaccess           # Apache configuration

================================================================================
  QUICK DEPLOYMENT STEPS
================================================================================

1. SET UP MONGODB DATABASE
   - Go to mongodb.com/cloud/atlas (free tier available)
   - Create cluster and database
   - Get connection string
   - See: MONGODB_SETUP_GUIDE.md in project root

2. UPLOAD FILES TO HOSTINGER
   
   A. Backend Files (via File Manager or FTP):
      - Upload entire "api" folder to: public_html/api/
      - Or upload contents of api/ to: public_html/api/
   
   B. Frontend Files:
      - Upload all contents of "public_html" folder to: public_html/ root
      - This includes: index.html, assets/, .htaccess

3. CREATE .ENV FILE ON SERVER
   - In public_html/api/ folder, create file: .env
   - Copy content from: api/.env.example (included in deploy folder)
   - OR copy from: deploy/api/.env.example
   - Update with your actual values:
     * MONGODB_URI (from MongoDB Atlas)
     * SMARTY_AUTH_ID and SMARTY_AUTH_TOKEN
     * EMAIL_USER and EMAIL_PASSWORD
     * VITE_API_URL (your domain)
     * FRONTEND_URL (your domain)

4. SET UP NODE.JS APPLICATION IN HPANEL
   - Go to: Advanced → Node.js
   - Create new application:
     * Application Root: /api (or /public_html/api)
     * Startup File: server.cjs
     * Port: 3000 (or auto-assigned)
   - Add all environment variables from .env file
   - Start application

5. CONFIGURE SSL
   - Go to: SSL in hPanel
   - Install free SSL certificate (Let's Encrypt)

6. TEST DEPLOYMENT
   - Visit: https://yourdomain.com
   - Test API: https://yourdomain.com/api/health
   - Test patient registration form

================================================================================
  IMPORTANT NOTES
================================================================================

✓ Dependencies are PRE-INSTALLED in api/node_modules/
  You don't need to run "npm install" on the server!

✓ Make sure to create .env file with your actual credentials

✓ Update VITE_API_URL and FRONTEND_URL with your actual domain

✓ MongoDB Atlas is recommended (free tier available)

✓ All files are production-ready and optimized

================================================================================
  DETAILED DOCUMENTATION
================================================================================

For complete step-by-step instructions, see in project root:
- HOSTINGER_DEPLOYMENT_GUIDE.md (Complete guide)
- MONGODB_SETUP_GUIDE.md (Database setup)
- DEPLOYMENT_CHECKLIST.md (Verification checklist)
- QUICK_DEPLOY.md (Quick reference)

================================================================================
  SUPPORT
================================================================================

If you encounter issues:
1. Check server logs in Node.js Manager
2. Verify .env file has correct values
3. Test MongoDB connection
4. Check browser console for errors
5. Review HOSTINGER_DEPLOYMENT_GUIDE.md troubleshooting section

================================================================================
  GOOD LUCK WITH YOUR DEPLOYMENT! 🚀
================================================================================

