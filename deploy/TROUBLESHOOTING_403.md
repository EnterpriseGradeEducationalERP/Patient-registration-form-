# 🔧 Troubleshooting 403 Forbidden Error

## Common Causes of 403 Error

A 403 error means the server is refusing to serve the file. Here are the most common causes and solutions:

---

## ✅ Solution 1: Check File Permissions

**Problem:** Files don't have correct permissions for the web server to read them.

**Fix via File Manager:**
1. Login to hPanel → **Files** → **File Manager**
2. Navigate to `public_html/`
3. Select all files and folders
4. Right-click → **Change Permissions**
5. Set permissions:
   - **Files:** `644` (rw-r--r--)
   - **Folders:** `755` (rwxr-xr-x)
6. Check **"Recurse into subdirectories"**
7. Click **Change Permissions**

**Fix via FTP/SSH:**
```bash
# Set file permissions
find public_html -type f -exec chmod 644 {} \;

# Set directory permissions
find public_html -type d -exec chmod 755 {} \;
```

---

## ✅ Solution 2: Simplify .htaccess File

The current `.htaccess` might be too strict. Try this simplified version:

**Replace your `.htaccess` with this simpler version:**

```apache
# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files that exist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API calls
  RewriteCond %{REQUEST_URI} !^/api
  
  # Don't rewrite assets
  RewriteCond %{REQUEST_URI} !\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$
  
  # Rewrite to index.html
  RewriteRule . /index.html [L]
</IfModule>
```

**Steps:**
1. Backup current `.htaccess`
2. Replace with simplified version above
3. Test your site

---

## ✅ Solution 3: Check Directory Index

**Problem:** Server can't find `index.html` or directory listing is disabled.

**Fix:**
1. Verify `index.html` exists in `public_html/` root
2. Check file name is exactly `index.html` (not `Index.html` or `INDEX.HTML`)
3. Ensure file has 644 permissions

**Add to .htaccess:**
```apache
DirectoryIndex index.html index.htm
```

---

## ✅ Solution 4: Disable File Protection Temporarily

The `.htaccess` has file protection rules that might be blocking access. Temporarily comment them out:

**Find this section in .htaccess:**
```apache
# Protect sensitive files
<FilesMatch "^(\.env|\.git|package\.json|package-lock\.json|\.htaccess)$">
  Order allow,deny
  Deny from all
</FilesMatch>
```

**Comment it out:**
```apache
# Protect sensitive files
# <FilesMatch "^(\.env|\.git|package\.json|package-lock\.json|\.htaccess)$">
#   Order allow,deny
#   Deny from all
# </FilesMatch>
```

---

## ✅ Solution 5: Check AllowOverride Settings

**Problem:** Server might not allow `.htaccess` overrides.

**Fix:**
1. Contact Hostinger support
2. Ask them to enable `AllowOverride All` for your domain
3. Or use a different approach (see Solution 6)

---

## ✅ Solution 6: Use Minimal .htaccess (Recommended)

If nothing else works, use this minimal `.htaccess`:

```apache
# Minimal .htaccess for React Router
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>
```

**Note:** This won't protect API routes, but it will get your site working. You can add API protection later.

---

## ✅ Solution 7: Check Server Error Logs

1. **In hPanel:**
   - Go to **Advanced** → **Error Log**
   - Check for specific error messages
   - Look for permission-related errors

2. **Common log messages:**
   - `Permission denied` → Fix file permissions
   - `Options not allowed` → Remove `Options -Indexes` from .htaccess
   - `mod_rewrite not enabled` → Contact support

---

## ✅ Solution 8: Verify File Structure

Ensure your files are in the correct location:

```
public_html/
├── index.html          ✅ Must exist
├── .htaccess           ✅ Must exist
├── assets/             ✅ Must exist
│   ├── index-*.css
│   └── index-*.js
└── favicon.ico         ✅ Optional but recommended
```

**Check:**
- All files are in `public_html/` root (not in a subfolder)
- File names match exactly (case-sensitive on Linux servers)
- No extra spaces in file names

---

## ✅ Solution 9: Test Without .htaccess

Temporarily rename `.htaccess` to `.htaccess.backup`:

1. Rename `.htaccess` → `.htaccess.backup`
2. Test if `index.html` loads directly
3. If it works, the problem is in `.htaccess`
4. If it doesn't, the problem is file permissions or structure

---

## ✅ Solution 10: Check Hostinger Specific Settings

1. **File Manager Settings:**
   - Ensure "Show Hidden Files" is enabled
   - Check if `.htaccess` is visible

2. **Domain Settings:**
   - Verify domain points to correct directory
   - Check if there are any domain-level restrictions

3. **PHP Settings:**
   - Some shared hosts require PHP to be enabled
   - Check PHP version settings

---

## 🔍 Quick Diagnostic Checklist

- [ ] File permissions: Files 644, Folders 755
- [ ] `index.html` exists in `public_html/` root
- [ ] `.htaccess` file exists and is readable
- [ ] File names are correct (case-sensitive)
- [ ] No syntax errors in `.htaccess`
- [ ] Server error logs checked
- [ ] Tried simplified `.htaccess`
- [ ] Tested without `.htaccess`

---

## 📞 Still Not Working?

1. **Check Hostinger Support:**
   - Contact support with error details
   - Ask about `.htaccess` restrictions
   - Request error log access

2. **Alternative Approach:**
   - Use subdomain for frontend
   - Use main domain for API
   - This avoids routing conflicts

---

## 🎯 Most Likely Solution

**90% of 403 errors are caused by:**
1. **File permissions** (Solution 1) - Most common
2. **.htaccess restrictions** (Solution 2) - Second most common

**Try these first!**

---

**Good luck! 🚀**

