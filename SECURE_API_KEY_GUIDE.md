# 🔒 Secure Your Google Vision API Key

## Two Options to Secure Your API Key

### Option 1: Backend Proxy (Most Secure) ⭐ Recommended

**Best for:** Maximum security, production apps

**How it works:**
- API key stays on your server
- App sends images to YOUR server
- Server calls Google Vision API
- API key never exposed to client

**Steps:**
1. Deploy backend proxy (see below)
2. Update app to use proxy URL
3. Done! API key is secure

---

### Option 2: API Key Restrictions (Simpler)

**Best for:** Quick setup, development/testing

**How it works:**
- Add restrictions in Google Cloud Console
- Limits who can use the key
- Still exposes key in app bundle (less secure)

**Steps:**
1. Go to Google Cloud Console
2. Add application restrictions
3. Add API restrictions
4. Set usage quotas
5. Done!

---

## 🚀 Option 1: Deploy Backend Proxy

### Quick Deploy to Vercel (5 minutes)

#### Step 1: Deploy via Vercel Website (Easiest)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your GitHub repository** (or upload `ocr-proxy-server` folder)
4. **Configure project:**
   - Framework Preset: **Other**
   - Root Directory: `ocr-proxy-server`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Name: `GOOGLE_VISION_API_KEY`
   - Value: (paste your API key from `.env` file)
   - Select: Production, Preview, Development
6. **Click "Deploy"**
7. **Wait ~1 minute** for deployment
8. **Copy your URL** (e.g., `https://splitt-ocr-proxy.vercel.app`)

#### Step 2: Update Your App

1. **Open `.env` file** in your project root
2. **Add this line:**
   ```
   EXPO_PUBLIC_OCR_PROXY_URL=https://your-app.vercel.app
   ```
   (Replace with your actual Vercel URL)

3. **Update `src/utils/googleVisionAPI.ts`:**
   - Change `USE_DIRECT_API = false` (to use proxy)
   - Or remove the direct API code entirely

4. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

#### Step 3: Test It!

1. Take a photo of a receipt
2. It should work through your secure proxy! 🎉

---

## 🔐 Option 2: Add API Key Restrictions

### Step 1: Application Restrictions

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Click on your API key**
3. **Under "Application restrictions":**
   - Select **"Android apps"**
   - **Package name**: `host.exp.exponent` (for Expo Go)
   - **SHA-1 fingerprint**: Get it with:
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
   - Look for "SHA1:" in the output

### Step 2: API Restrictions

1. **Under "API restrictions":**
   - Select **"Restrict key"**
   - **Check only "Cloud Vision API"**
   - Uncheck all other APIs

### Step 3: Usage Quotas

1. **Go to**: https://console.cloud.google.com/apis/api/vision.googleapis.com/quotas
2. **Set daily quota** (e.g., 1000 requests/day)
3. **Save**

### Step 4: Billing Alerts

1. **Go to**: https://console.cloud.google.com/billing/budgets
2. **Create budget** ($10/month recommended)
3. **Set email alerts**

---

## ✅ Which Should You Choose?

**Choose Backend Proxy if:**
- ✅ You want maximum security
- ✅ You're building for production
- ✅ You don't want API key in app bundle
- ✅ You can deploy a simple server

**Choose API Restrictions if:**
- ✅ You want quick setup
- ✅ You're in development/testing
- ✅ You're okay with key in app bundle (with restrictions)
- ✅ You don't want to manage a server

---

## 🆘 Need Help?

- **Deployment issues?** Check `DEPLOYMENT_STEPS.md`
- **Vercel problems?** Check `ocr-proxy-server/README.md`
- **API key setup?** Check `GOOGLE_VISION_SETUP.md`

---

**Recommendation: Use Backend Proxy for production!** 🔒
