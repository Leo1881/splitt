# 🔧 Fix Vercel Serverless Function Crash

## Most Common Issue: Missing Environment Variable

The crash is likely because `GOOGLE_VISION_API_KEY` is not set in Vercel.

## Quick Fix Steps

### 1. Check Vercel Environment Variables

1. **Go to your Vercel project**: https://vercel.com/dashboard
2. **Click on your project** (splitt-ocr-proxy or similar)
3. **Go to Settings** → **Environment Variables**
4. **Check if `GOOGLE_VISION_API_KEY` exists:**
   - If it doesn't exist → Add it (see step 2)
   - If it exists → Check the value is correct

### 2. Add Environment Variable (if missing)

1. **Click "Add New"**
2. **Name**: `GOOGLE_VISION_API_KEY`
3. **Value**: `AIzaSyD_4cCWrIbcMVaMqClbXKldPL0unVVZdr0`
4. **Select**: Production, Preview, Development (check all three)
5. **Click "Save"**

### 3. Redeploy

After adding the environment variable:

1. **Go to "Deployments" tab**
2. **Click the three dots** on the latest deployment
3. **Click "Redeploy"**
4. **Wait for deployment to complete** (~1 minute)

### 4. Test Again

Visit: `https://splitt-k8v7fbkwt-lees-projects-e158146e.vercel.app/health`

Should see:
```json
{
  "status": "ok",
  "message": "OCR Proxy Server is running",
  "hasApiKey": true
}
```

---

## Alternative: Check Vercel Logs

1. **Go to your Vercel project**
2. **Click "Deployments"**
3. **Click on the latest deployment**
4. **Click "Functions" tab**
5. **Check the logs** for error messages

This will show you exactly what's wrong!

---

## If Still Not Working

The code has been updated. You may need to:

1. **Push the updated code to GitHub** (if using Git)
2. **Or re-upload the `ocr-proxy-server` folder** to Vercel
3. **Make sure environment variable is set**
4. **Redeploy**

Let me know what you see in the Vercel logs!
