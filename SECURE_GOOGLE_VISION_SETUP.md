# 🔒 Secure Google Vision API Setup for Splitt App

## 🎯 Goal: Highly Restricted API Key for Mobile App Only

This guide will help you create a Google Vision API key that's **highly restricted** to only work with your Splitt mobile app.

---

## 📋 Step 1: Enable Vision API

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create a new one)
3. **Navigate to APIs & Services > Library**
4. **Search for "Cloud Vision API"**
5. **Click "Enable"**

---

## 🔑 Step 2: Create Highly Restricted API Key

### 2.1 Create New API Key

1. **Go to APIs & Services > Credentials**
2. **Click "Create Credentials" > "API Key"**
3. **Copy the API key** (you'll need this)

### 2.2 Apply Application Restrictions

1. **Click on your API key** to edit it
2. **Under "Application restrictions":**
   - Select **"Android apps"**
   - **Add your app's package name**: `host.exp.exponent` (for Expo Go)
   - **Add SHA-1 certificate fingerprint** (see below for how to get this)

### 2.3 Apply API Restrictions

1. **Under "API restrictions":**
   - Select **"Restrict key"**
   - **Check only "Cloud Vision API"**
   - **Uncheck all other APIs**

### 2.4 Set Usage Quotas (Optional but Recommended)

1. **Go to APIs & Services > Quotas**
2. **Find "Cloud Vision API"**
3. **Set daily quota limits** (e.g., 1000 requests/day for development)

---

## 📱 Step 3: Get Your App's SHA-1 Fingerprint

### For Expo Go (Development):

```bash
# Run this command to get the SHA-1 fingerprint for Expo Go
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### For Production Build:

```bash
# You'll need your production keystore
keytool -list -v -keystore your-production-keystore.jks -alias your-key-alias
```

---

## 🔒 Step 4: Additional Security Measures

### 4.1 Enable Billing Alerts

1. **Go to Billing > Budgets & Alerts**
2. **Create a budget** with email alerts
3. **Set a reasonable limit** (e.g., $10/month)

### 4.2 Monitor API Usage

1. **Go to APIs & Services > Dashboard**
2. **Monitor your Vision API usage**
3. **Set up alerts for unusual activity**

### 4.3 IP Restrictions (Optional)

- **For server-side usage only**
- **Add your server's IP addresses**
- **Not applicable for mobile apps**

---

## 🧪 Step 5: Test Your Restricted API Key

### 5.1 Update Your App

Replace the API key in `src/utils/googleVisionAPI.ts`:

```typescript
const GOOGLE_VISION_API_KEY = "YOUR_NEW_RESTRICTED_API_KEY";
```

### 5.2 Test the Restrictions

1. **Try using the API key from a different app** (should fail)
2. **Try calling other Google APIs** (should fail)
3. **Test with your Splitt app** (should work)

---

## 🚨 Security Best Practices

### ✅ DO:

- **Use application restrictions** (Android package name + SHA-1)
- **Restrict to Vision API only**
- **Set usage quotas**
- **Monitor usage regularly**
- **Rotate keys periodically**

### ❌ DON'T:

- **Share API keys in public repositories**
- **Use unrestricted keys in production**
- **Ignore billing alerts**
- **Use the same key for multiple projects**

---

## 🔄 Step 6: Production Considerations

### For Production Build:

1. **Create a separate API key** for production
2. **Use your production app's package name**
3. **Use your production keystore's SHA-1**
4. **Set stricter quotas**

### Environment Variables:

Consider using environment variables for different environments:

```typescript
const GOOGLE_VISION_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || "YOUR_DEV_KEY";
```

---

## 📞 Support

If you encounter issues:

1. **Check the Google Cloud Console** for error messages
2. **Verify your package name** matches exactly
3. **Ensure SHA-1 fingerprint** is correct
4. **Wait 5-10 minutes** after making changes

---

## 🎯 Final Checklist

- [ ] Vision API enabled
- [ ] API key created
- [ ] Application restrictions set (Android + SHA-1)
- [ ] API restrictions set (Vision API only)
- [ ] Usage quotas configured
- [ ] Billing alerts enabled
- [ ] API key updated in app
- [ ] Tested with restricted key
- [ ] Production key planned

---

**🔐 Your API key is now highly restricted to your Splitt app only!**
