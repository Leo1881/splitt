# 🔒 Complete API Key Security Setup

**Doing both = Maximum Security!** 🛡️

- ✅ API Key Restrictions = Limits what the key can do
- ✅ Backend Proxy = Keeps key off client devices

---

## Step 1: Add API Key Restrictions (5 minutes)

### Get Your SHA-1 Fingerprint

Run this command in your terminal:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Look for "SHA1:"** and copy the value (looks like: `A1:B2:C3:D4:E5:...`)

### Add Restrictions in Google Cloud Console

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Click your API key** (starts with `AIza...`)
3. **Application restrictions:**
   - Select **"Android apps"**
   - Package name: `host.exp.exponent`
   - SHA-1: (paste the SHA-1 from above)
4. **API restrictions:**
   - Select **"Restrict key"**
   - Check **only "Cloud Vision API"**
5. **Usage quotas:**
   - Go to: https://console.cloud.google.com/apis/api/vision.googleapis.com/quotas
   - Set daily limit: 1000 requests/day
6. **Billing alerts:**
   - Go to: https://console.cloud.google.com/billing/budgets
   - Create $10/month budget with email alerts
7. **Click "Save"**
8. **Wait 2-3 minutes** for changes to take effect

---

## Step 2: Deploy Backend Proxy (5 minutes)

### Deploy to Vercel

#### Option A: Via Vercel Website (Easiest)

1. **Go to**: https://vercel.com
2. **Sign in** (or create account - it's free)
3. **Click "Add New Project"**
4. **Import your repository:**
   - Connect GitHub (if your repo is on GitHub)
   - OR click "Browse" and upload the `ocr-proxy-server` folder
5. **Configure project:**
   - Framework Preset: **Other**
   - Root Directory: `ocr-proxy-server`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. **Environment Variables:**
   - Click "Environment Variables"
   - Name: `GOOGLE_VISION_API_KEY`
   - Value: `AIzaSyD_4cCWrIbcMVaMqClbXKldPL0unVVZdr0`
   - Select: Production, Preview, Development
7. **Click "Deploy"**
8. **Wait ~1 minute** for deployment
9. **Copy your deployment URL** (e.g., `https://splitt-ocr-proxy.vercel.app`)

#### Option B: Via Vercel CLI

```bash
cd ocr-proxy-server
vercel login
vercel
# Follow prompts, then:
vercel env add GOOGLE_VISION_API_KEY
# Paste your API key when prompted
vercel --prod
```

---

## Step 3: Update Your App

1. **Open `.env` file**
2. **Add your proxy URL:**
   ```
   EXPO_PUBLIC_OCR_PROXY_URL=https://your-vercel-url.vercel.app
   ```
   (Replace with your actual Vercel URL)

3. **The app is already configured** to use the proxy (we set `USE_DIRECT_API = false`)

4. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

---

## Step 4: Test It!

1. Take a photo of a receipt
2. It should work through your secure proxy! 🎉

---

## ✅ Security Checklist

- [ ] API key has application restrictions (Android + SHA-1)
- [ ] API key restricted to Vision API only
- [ ] Usage quotas set (1000/day)
- [ ] Billing alerts configured
- [ ] Backend proxy deployed to Vercel
- [ ] API key added to Vercel environment variables
- [ ] App updated with proxy URL
- [ ] Tested and working!

---

## 🛡️ What You've Achieved

**Double Protection:**
1. **API Restrictions** = Even if key is exposed, it can only be used by your app for Vision API
2. **Backend Proxy** = Key never exposed to client in the first place

**This is enterprise-level security!** 🔒

---

## 🆘 Troubleshooting

**403 Error after restrictions?**
- Wait 2-3 minutes for changes to propagate
- Double-check SHA-1 fingerprint matches exactly
- Verify package name is correct

**Proxy not working?**
- Check Vercel deployment logs
- Verify environment variable is set
- Test health endpoint: `https://your-url.vercel.app/health`

**Need help?** Check the other guides or ask!
