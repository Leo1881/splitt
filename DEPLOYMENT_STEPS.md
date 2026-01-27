# 🚀 Step-by-Step Deployment Guide

Follow these steps to deploy your secure OCR proxy:

## Step 1: Get Your Google Vision API Key

If you don't have one yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Cloud Vision API"
4. Go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "API Key"
6. **Copy the API key** (starts with `AIza...`)

⚠️ **Important**: We'll add restrictions later to secure it!

## Step 2: Deploy to Vercel

### Option A: Using Vercel Website (Easiest)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "Add New Project"**
3. **Import your repository** (or upload the `ocr-proxy-server` folder)
4. **Configure**:
   - Framework Preset: **Other**
   - Root Directory: `ocr-proxy-server`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. **Add Environment Variable**:
   - Name: `GOOGLE_VISION_API_KEY`
   - Value: (paste your API key)
6. **Click "Deploy"**
7. **Wait for deployment** (~1 minute)
8. **Copy your deployment URL** (e.g., `https://your-app.vercel.app`)

### Option B: Using Vercel CLI (If permissions work)

Run these commands in your terminal:

```bash
cd ocr-proxy-server
vercel login
vercel
# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? splitt-ocr-proxy
# - Directory? ./
# - Override settings? No

# After deployment, add your API key:
vercel env add GOOGLE_VISION_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development (all)

# Redeploy with the environment variable:
vercel --prod
```

## Step 3: Update Your App

1. **Open your `.env` file** (in the root of your project)
2. **Add this line**:
   ```
   EXPO_PUBLIC_OCR_PROXY_URL=https://your-app.vercel.app
   ```
   (Replace with your actual Vercel URL)

3. **Restart Expo**:
   ```bash
   npx expo start --clear
   ```

## Step 4: Test It!

1. Open your app
2. Take a photo of a receipt
3. It should process through your secure proxy! 🎉

## Step 5: Secure Your API Key (Important!)

After deployment, secure your Google Vision API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to "APIs & Services" > "Credentials"
3. Click on your API key
4. **Set Application Restrictions**:
   - Select "Android apps"
   - Add package name: `host.exp.exponent` (for Expo Go)
   - Add SHA-1 fingerprint (see below)
5. **Set API Restrictions**:
   - Select "Restrict key"
   - Check only "Cloud Vision API"
6. **Set Usage Quotas**:
   - Go to "APIs & Services" > "Quotas"
   - Set daily limit (e.g., 1000 requests/day)
7. **Set Billing Alerts**:
   - Go to "Billing" > "Budgets & Alerts"
   - Create a budget with email alerts

### Get SHA-1 Fingerprint (for Expo Go):

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Look for "SHA1:" in the output.

## 🆘 Troubleshooting

### "API key not configured" error
- Make sure you added `GOOGLE_VISION_API_KEY` to Vercel environment variables
- Redeploy after adding the variable

### "Proxy server error"
- Check your Vercel deployment URL is correct in `.env`
- Make sure the deployment succeeded on Vercel
- Check Vercel logs for errors

### "Network request failed"
- Check your internet connection
- Verify the Vercel URL is accessible
- Check Vercel deployment status

## ✅ Checklist

- [ ] Google Vision API key created
- [ ] Backend deployed to Vercel
- [ ] `GOOGLE_VISION_API_KEY` added to Vercel environment variables
- [ ] `EXPO_PUBLIC_OCR_PROXY_URL` added to `.env` file
- [ ] Expo restarted with `--clear` flag
- [ ] Tested with a receipt photo
- [ ] API key restrictions applied (optional but recommended)

---

**You're all set! Your API key is now secure on the server.** 🔐
