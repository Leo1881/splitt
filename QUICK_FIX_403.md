# 🔧 Quick Fix for 403 Error

## Step 1: Enable Vision API

1. **Go to**: https://console.cloud.google.com/apis/api/vision.googleapis.com/overview
2. **Click the big blue "ENABLE" button**
3. Wait for it to enable (takes ~10 seconds)

## Step 2: Set Up Billing (Required!)

Even for the free tier, Google requires billing to be set up:

1. **Go to**: https://console.cloud.google.com/billing
2. **Click "Link a billing account"** or **"Create billing account"**
3. **Add a payment method** (credit card)
4. **Don't worry** - you get 1,000 free requests per month!
5. **Set a budget alert** (optional but recommended):
   - Go to "Budgets & Alerts"
   - Create a budget for $10/month
   - Get email alerts if you exceed it

## Step 3: Verify Your API Key

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Click on your API key** (the one starting with `AIza...`)
3. **Check**:
   - Is it from the correct project?
   - Is it enabled?
   - Copy it again to make sure it matches your `.env` file

## Step 4: Test Again

1. **Restart your app**:
   ```bash
   npx expo start --clear
   ```
2. **Take a photo of a receipt**
3. **Check the console** for the detailed error message

## Still Getting 403?

Check the console error message - it should now show more details about what's wrong.

Common issues:
- ✅ Vision API enabled? → Check Step 1
- ✅ Billing set up? → Check Step 2  
- ✅ API key correct? → Check Step 3
- ✅ Wait 2-3 minutes after enabling (Google needs time to propagate)

---

**Most common issue: Billing not set up!** Even though it's free, Google requires it.
