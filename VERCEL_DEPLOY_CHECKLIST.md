# ✅ Vercel Deployment Checklist

## Quick Steps

1. **Go to**: https://vercel.com
2. **Sign in** (or create free account)
3. **Click "Add New Project"**
4. **Import repository** (GitHub) or **upload `ocr-proxy-server` folder**
5. **Settings:**
   - Framework: **Other**
   - Root Directory: `ocr-proxy-server`
6. **Environment Variables:**
   - Name: `GOOGLE_VISION_API_KEY`
   - Value: `AIzaSyD_4cCWrIbcMVaMqClbXKldPL0unVVZdr0`
   - Select: Production, Preview, Development
7. **Click "Deploy"**
8. **Copy your URL** (e.g., `https://splitt-ocr-proxy.vercel.app`)

## After Deployment

1. **Test health endpoint:**
   - Visit: `https://your-url.vercel.app/health`
   - Should see: `{"status":"ok","message":"OCR Proxy Server is running"}`

2. **Update `.env` file:**
   ```
   EXPO_PUBLIC_OCR_PROXY_URL=https://your-url.vercel.app
   ```

3. **Restart app:**
   ```bash
   npx expo start --clear
   ```

4. **Test with a receipt photo!**

---

**Once you have the Vercel URL, let me know and I'll help update your app!**
