# How to Create Your .env File

## ⚠️ Your .env File Has Encoding Issues

The `.env` file needs to be created with proper UTF-8 encoding (no BOM). Follow these steps:

---

## ✅ Method 1: Create Using VS Code (Recommended)

### Step 1: Create New File
1. In VS Code, click **File → New File** (or press `Ctrl+N`)
2. **DO NOT** save yet

### Step 2: Copy This Content
Copy and paste this **exact content** into the new file:

```
# ============================================
# Patient Registration System - Environment Variables
# ============================================
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
MONGODB_URI=mongodb://localhost:27017/NHS_NPMS
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development
PORT=3000
```

### Step 3: Set Encoding
1. Click on **"UTF-8"** in the bottom-right status bar (or **File → Preferences → Settings**)
2. Select **"Save with Encoding"**
3. Choose **"UTF-8"** (NOT "UTF-8 with BOM")

### Step 4: Save File
1. Press `Ctrl+S` to save
2. Name the file: **`.env`** (with the dot at the beginning)
3. Save in the **project root** (same folder as `server.cjs`)
4. If VS Code warns about encoding, click **"Open Anyway"** or **"Save with Encoding"** → **"UTF-8"**

---

## ✅ Method 2: Create Using Notepad++ (Windows)

1. Open **Notepad++**
2. Paste the content above
3. Go to **Encoding → Convert to UTF-8** (NOT UTF-8-BOM)
4. Go to **File → Save As**
5. Name it: **`.env`**
6. Set **Save as type:** to **"All types (*.*)"**
7. Save in project root

---

## ✅ Method 3: Create Using Command Line

### Windows (PowerShell):
```powershell
@"
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
MONGODB_URI=mongodb://localhost:27017/NHS_NPMS
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development
PORT=3000
"@ | Out-File -FilePath .env -Encoding utf8 -NoNewline
```

### Mac/Linux:
```bash
cat > .env << 'EOF'
SMARTY_AUTH_ID=1661d522-1b74-452f-bb63-463bdedd9fa3
SMARTY_AUTH_TOKEN=SZkQ3ygTc5hiVL6RC9KR
MONGODB_URI=mongodb://localhost:27017/NHS_NPMS
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development
PORT=3000
EOF
```

---

## ✅ Method 4: Copy from .env.example

1. Copy the file `.env.example` (I've created this for you)
2. Rename it to `.env`
3. Make sure encoding is UTF-8 (no BOM)

---

## 🔍 Verify Your .env File

### Check File Location:
- ✅ Must be in **project root** (same folder as `server.cjs`)
- ❌ NOT in `server/` folder
- ❌ NOT in `src/` folder

### Check File Name:
- ✅ Must be exactly `.env` (with dot at start)
- ❌ NOT `.env.txt`
- ❌ NOT `env`
- ❌ NOT `.env.example`

### Check Content Format:
- ✅ No spaces around `=` sign
- ✅ No quotes around values
- ✅ No trailing spaces
- ✅ Each variable on its own line

### Check Encoding:
- ✅ UTF-8 (without BOM)
- ❌ NOT UTF-8-BOM
- ❌ NOT UTF-16
- ❌ NOT ANSI

---

## 🧪 Test Your .env File

After creating the file:

1. **Restart your server:**
   ```bash
   # Stop server (Ctrl+C)
   node server.cjs
   ```

2. **Check server logs** - You should see:
   ```
   ✅ Smarty Streets API configured
   ✅ Smarty credentials found
      Auth ID: 1661d522...
      Auth Token: SZkQ...
   ```

3. **If you see warnings:**
   ```
   ⚠️  Smarty credentials not found in .env
   ```
   Then the file isn't being read correctly - check encoding and location.

---

## 🆘 Still Having Issues?

### Issue: VS Code Shows Encoding Warning
**Solution:** 
- Click **"Open Anyway"** or **"Save with Encoding"** → **"UTF-8"**
- Make sure it's UTF-8, NOT UTF-8-BOM

### Issue: File Not Found by Server
**Solution:**
- Make sure file is named exactly `.env` (with dot)
- Make sure it's in project root (same folder as `server.cjs`)
- Restart server after creating file

### Issue: Credentials Not Loading
**Solution:**
- Check file encoding is UTF-8 (no BOM)
- Check no spaces around `=` signs
- Check no quotes around values
- Restart server

---

## 📝 Quick Checklist

- [ ] File created with name `.env` (with dot)
- [ ] File saved in project root
- [ ] Encoding is UTF-8 (no BOM)
- [ ] Content matches template above
- [ ] No spaces around `=` signs
- [ ] No quotes around values
- [ ] Server restarted after creating file
- [ ] Server logs show "✅ Smarty Streets API configured"

---

**Once your .env file is created correctly, restart your server and the address verification should work!**

