# ✅ Hostinger Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## 📦 Pre-Deployment Preparation

### Local Setup
- [ ] Project builds successfully: `npm run build`
- [ ] All tests pass (if any)
- [ ] Environment variables documented
- [ ] Dependencies are up to date
- [ ] No console errors in development
- [ ] All features tested locally

### Files to Prepare
- [ ] `dist/` folder built and ready
- [ ] `server.cjs` updated for production
- [ ] `.env.production` file created with correct values
- [ ] `.htaccess` file ready
- [ ] `package.json` has production scripts

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
- [ ] MongoDB Atlas account created
- [ ] Cluster created (Free tier M0)
- [ ] Database user created with read/write permissions
- [ ] Network access configured (IP whitelist)
- [ ] Connection string obtained and tested
- [ ] Database name set: `NHS_NPMS`

### Alternative: Hostinger MongoDB
- [ ] MongoDB database created in hPanel
- [ ] Database user created
- [ ] Connection string obtained
- [ ] Connection tested

---

## 📤 File Upload

### Backend Files (api/ folder)
- [ ] `server.cjs` uploaded
- [ ] `server/` folder uploaded (all service files)
- [ ] `package.json` uploaded
- [ ] `.env` file created on server (from `.env.production`)

### Frontend Files
- [ ] `dist/` folder contents uploaded to `public_html/`
- [ ] All assets (CSS, JS, images) uploaded
- [ ] `index.html` in correct location

### Configuration Files
- [ ] `.htaccess` uploaded to `public_html/`
- [ ] File permissions set correctly

---

## ⚙️ Server Configuration

### Node.js Setup
- [ ] Node.js application created in hPanel
- [ ] Node.js version selected (18.x or 20.x LTS)
- [ ] Application root path set correctly
- [ ] Startup file set to `server.cjs`
- [ ] Port configured (3000 or auto-assigned)

### Environment Variables
- [ ] `MONGODB_URI` set in Node.js Manager
- [ ] `SMARTY_AUTH_ID` set
- [ ] `SMARTY_AUTH_TOKEN` set
- [ ] `EMAIL_USER` set
- [ ] `EMAIL_PASSWORD` set
- [ ] `NODE_ENV=production` set
- [ ] `PORT` set (if not auto-assigned)
- [ ] `VITE_API_URL` set (for frontend)
- [ ] `FRONTEND_URL` set (for CORS)

### Dependencies
- [ ] SSH access enabled (or Terminal access)
- [ ] Navigated to `api/` folder
- [ ] Ran `npm install --production`
- [ ] All dependencies installed successfully
- [ ] No installation errors

---

## 🌐 Domain & SSL

### Domain Configuration
- [ ] Domain/subdomain configured
- [ ] API subdomain created (if using): `api.yourdomain.com`
- [ ] DNS records updated (if needed)
- [ ] Domain points to correct directory

### SSL Certificate
- [ ] SSL certificate installed
- [ ] HTTPS enabled
- [ ] Force HTTPS redirect configured
- [ ] Certificate valid and not expired

### Routing
- [ ] `.htaccess` file working
- [ ] React Router paths working
- [ ] API routes accessible
- [ ] No 404 errors on page refresh

---

## 🧪 Testing

### Backend API Tests
- [ ] Health check endpoint works: `/api/health`
- [ ] MongoDB connection successful (check logs)
- [ ] Patient registration endpoint works: `POST /api/register-patient`
- [ ] Patient list endpoint works: `GET /api/patients`
- [ ] Address verification works: `POST /api/verify-address`
- [ ] Pharmacy search works: `GET /api/search-pharmacies/:zipCode`
- [ ] Email test works: `GET /api/test-email`

### Frontend Tests
- [ ] Homepage loads correctly
- [ ] No console errors in browser
- [ ] API calls work (check Network tab)
- [ ] Form submission works
- [ ] Address validation works
- [ ] Pharmacy search works
- [ ] All form steps work correctly
- [ ] Success/error messages display correctly

### Integration Tests
- [ ] Complete patient registration flow works
- [ ] Data saved to MongoDB
- [ ] Confirmation email sent (if configured)
- [ ] Duplicate detection works
- [ ] Error handling works correctly

---

## 🔒 Security

### Security Checks
- [ ] `.env` file not accessible via web
- [ ] Sensitive files protected (`.htaccess` configured)
- [ ] CORS configured correctly
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] No sensitive data in frontend code

### Credentials
- [ ] All API keys secured in environment variables
- [ ] Database credentials secure
- [ ] Email credentials secure
- [ ] No hardcoded secrets in code

---

## 📊 Monitoring & Maintenance

### Logging
- [ ] Server logs accessible
- [ ] Error logging working
- [ ] Log rotation configured (if available)

### Backups
- [ ] MongoDB backups configured (Atlas does this automatically)
- [ ] Backup schedule set (if manual)
- [ ] Backup restoration tested

### Performance
- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] Database queries optimized
- [ ] Gzip compression working

---

## 📝 Documentation

### Documentation Updated
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Troubleshooting guide available

---

## 🎯 Post-Deployment

### Final Checks
- [ ] Application accessible via domain
- [ ] All features working in production
- [ ] No critical errors in logs
- [ ] Performance acceptable
- [ ] Mobile responsiveness works
- [ ] Cross-browser compatibility verified

### Team Communication
- [ ] Team notified of deployment
- [ ] Access credentials shared (if needed)
- [ ] Monitoring alerts set up (if available)

---

## 🆘 Troubleshooting Resources

If issues occur, check:
- [ ] Server logs in Node.js Manager
- [ ] Browser console for frontend errors
- [ ] Network tab for API call failures
- [ ] MongoDB connection status
- [ ] Environment variables are set correctly
- [ ] File permissions are correct
- [ ] SSL certificate is valid

---

## ✅ Deployment Complete!

Once all items are checked:
- [ ] Application is live and functional
- [ ] All features tested and working
- [ ] Documentation updated
- [ ] Team notified

**Deployment Date:** _______________
**Deployed By:** _______________
**Domain:** _______________

---

**Next Steps:**
1. Monitor application for first 24-48 hours
2. Set up regular backups
3. Configure monitoring/analytics (optional)
4. Plan for future updates/maintenance

