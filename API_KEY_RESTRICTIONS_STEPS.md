# 🔐 Step 1: Add API Key Restrictions

## Quick Steps (2 minutes)

### 1. Go to Google Cloud Console
**Link**: https://console.cloud.google.com/apis/credentials

### 2. Find Your API Key
- Look for the key starting with `AIzaSyD_4cCWrIbcMVaMqClbXKldPL0unVVZdr0`
- Click on it to edit

### 3. Add Application Restrictions

1. **Under "Application restrictions":**
   - Select **"Android apps"**
   - Click **"Add an item"**
   - **Package name**: `host.exp.exponent` (for Expo Go)
   - **SHA-1 certificate fingerprint**: Get it with the command below

2. **Get SHA-1 Fingerprint:**
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
   - Look for the line that says **"SHA1:"**
   - Copy the SHA-1 value (looks like: `A1:B2:C3:D4:...`)

3. **Paste SHA-1** into the Google Cloud Console

### 4. Add API Restrictions

1. **Under "API restrictions":**
   - Select **"Restrict key"**
   - **Uncheck all APIs**
   - **Check only "Cloud Vision API"**
   - Leave everything else unchecked

### 5. Set Usage Quotas (Optional but Recommended)

1. **Go to**: https://console.cloud.google.com/apis/api/vision.googleapis.com/quotas
2. **Find "Requests per day"**
3. **Click "Edit Quotas"**
4. **Set limit**: 1000 requests/day (or your preferred limit)
5. **Save**

### 6. Set Billing Alerts

1. **Go to**: https://console.cloud.google.com/billing/budgets
2. **Click "Create Budget"**
3. **Set amount**: $10/month (or your preference)
4. **Add email alerts**
5. **Save**

### 7. Save Your Changes

- Click **"Save"** at the bottom
- Wait 2-3 minutes for changes to propagate

---

## ✅ Checklist

- [ ] Application restrictions added (Android + SHA-1)
- [ ] API restrictions set (Vision API only)
- [ ] Usage quotas configured
- [ ] Billing alerts set up
- [ ] Changes saved

---

**Next**: Deploy the backend proxy (Step 2)
