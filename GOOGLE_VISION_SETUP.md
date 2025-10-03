# Google Vision API Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Splitt OCR"
4. Click "Create"

### 2. Enable Vision API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Vision API"
3. Click on "Cloud Vision API"
4. Click "Enable"

### 3. Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key (starts with "AIza...")

### 4. Update the App

1. Open `src/utils/googleVisionAPI.ts`
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```typescript
   const GOOGLE_VISION_API_KEY = "AIzaSyC..."; // Your actual key
   ```

### 5. Set Billing (Required for API calls)

1. Go to "Billing" in Google Cloud Console
2. Link a payment method (required even for free tier)
3. **Don't worry** - you get 1,000 free requests per month!

## 💰 Pricing

- **Free Tier**: 1,000 requests per month
- **After Free Tier**: $1.50 per 1,000 requests
- **Your Usage**: Likely < 100 requests per month

## 🔒 Security Note

For production, you should:

1. Use environment variables for the API key
2. Restrict the API key to your app's bundle ID
3. Consider using a backend proxy instead of direct API calls

## ✅ Test It

1. Run the app
2. Take a photo of a receipt
3. Check the OCR data screen to see real extracted text!

## 🆘 Troubleshooting

- **"API key not valid"**: Check the key is correct
- **"Billing required"**: Set up billing in Google Cloud Console
- **"Quota exceeded"**: You've used your free 1,000 requests
- **"No text detected"**: Try a clearer photo or different receipt
