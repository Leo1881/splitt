# 🔒 Secure OCR Setup Guide

## ✅ Recommended Solution: Backend Proxy

I've set up a **secure backend proxy** for you. This is the safest option because:

- ✅ **API key never exposed** - stays on your server
- ✅ **Free to deploy** - Vercel, Railway, or Render
- ✅ **Easy setup** - 5 minutes to deploy
- ✅ **Production-ready** - scalable and secure

## 🚀 Quick Start (5 Minutes)

### Step 1: Deploy Backend Proxy

1. **Go to the `ocr-proxy-server` folder**
2. **Deploy to Vercel** (easiest, free):
   ```bash
   cd ocr-proxy-server
   npm install -g vercel
   vercel
   ```
3. **Set your Google Vision API key**:
   ```bash
   vercel env add GOOGLE_VISION_API_KEY
   # Paste your API key when prompted
   ```
4. **Deploy to production**:
   ```bash
   vercel --prod
   ```
5. **Copy your URL** (e.g., `https://your-app.vercel.app`)

### Step 2: Update Your App

1. **Create/update `.env` file**:
   ```bash
   EXPO_PUBLIC_OCR_PROXY_URL=https://your-app.vercel.app
   ```

2. **Restart Expo**:
   ```bash
   npx expo start --clear
   ```

### Step 3: Test It!

Take a photo of a receipt - it should work! 🎉

## 📋 What I Created For You

1. **`ocr-proxy-server/`** - Backend server (Express.js)
   - Handles OCR requests securely
   - Keeps API key on server
   - Ready to deploy

2. **Updated `src/utils/googleVisionAPI.ts`**
   - Now uses your backend proxy
   - Falls back to direct API if needed (for testing)

3. **Deployment configs**
   - `vercel.json` - For Vercel
   - `package.json` - Dependencies
   - `README.md` - Full instructions

## 🔒 Security Features

- ✅ API key never sent to client
- ✅ CORS protection
- ✅ Error handling
- ✅ Request validation
- ✅ Free hosting options

## 💡 Alternative: Direct API (Less Secure)

If you want to test without deploying a backend:

1. Set `USE_DIRECT_API = true` in `googleVisionAPI.ts`
2. Add `EXPO_PUBLIC_GOOGLE_VISION_API_KEY` to `.env`
3. **⚠️ Remember**: This exposes your API key in the app bundle

## 🆘 Need Help?

- **Deployment issues?** Check `ocr-proxy-server/README.md`
- **API key setup?** Check `GOOGLE_VISION_SETUP.md`
- **Security questions?** Check `SECURE_GOOGLE_VISION_SETUP.md`

## 🎯 Next Steps

1. Deploy the backend proxy (5 min)
2. Update your `.env` file
3. Test with a receipt photo
4. You're done! 🎉

---

**Your API key is now secure!** 🔐
