# 🔒 Quick API Key Security Setup

## Option 1: Backend Proxy (Most Secure) ⭐

### Deploy to Vercel (5 minutes)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Choose "Import Git Repository"** (connect your GitHub)
   - OR click "Browse" and upload the `ocr-proxy-server` folder
4. **Configure:**
   - Framework: **Other**
   - Root Directory: `ocr-proxy-server`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. **Environment Variables:**
   - Click "Environment Variables"
   - Add: `GOOGLE_VISION_API_KEY` = `AIzaSyD_4cCWrIbcMVaMqClbXKldPL0unVVZdr0`
   - Select: Production, Preview, Development
6. **Click "Deploy"**
7. **Copy your URL** (e.g., `https://splitt-ocr.vercel.app`)

### Update Your App

1. **Add to `.env`:**
   ```
   EXPO_PUBLIC_OCR_PROXY_URL=https://your-vercel-url.vercel.app
   ```

2. **Restart app:**
   ```bash
   npx expo start --clear
   ```

**Done! Your API key is now secure on the server.** 🔐

---

## Option 2: API Key Restrictions (Simpler)

### Quick Setup (2 minutes)

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Click your API key** (`AIzaSyD_4cCWrIbcMVaMqClbXKldPL0unVVZdr0`)
3. **Application restrictions:**
   - Select "Android apps"
   - Package: `host.exp.exponent`
   - SHA-1: (get with command below)
4. **API restrictions:**
   - Select "Restrict key"
   - Check only "Cloud Vision API"
5. **Save**

**Get SHA-1:**
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Look for "SHA1:" in output.

---

## Which Should You Use?

**Backend Proxy** = Most secure, API key never in app
**API Restrictions** = Quick setup, key still in app (but restricted)

**I recommend Backend Proxy for production!**
