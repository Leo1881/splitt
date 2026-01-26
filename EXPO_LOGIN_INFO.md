# Expo Login - Why and When

## Why Expo Asks for Login

Expo CLI may prompt you to login for several reasons:

1. **EAS (Expo Application Services)** - Cloud builds, updates, and deployment
2. **expo-updates** - Over-the-air updates require an Expo account
3. **Analytics** - Usage tracking and error reporting
4. **Tunneling** - Using `expo start --tunnel` requires login

## ✅ You DON'T Need to Login For:

- **Local Development** - Running `npm start` or `expo start` locally
- **Expo Go** - Scanning QR codes and testing in Expo Go app
- **Simulators/Emulators** - Running on iOS Simulator or Android Emulator
- **Web Development** - Running `npm run web`

## 🔐 You DO Need to Login For:

- **EAS Builds** - Building production apps (`eas build`)
- **EAS Submit** - Submitting to app stores (`eas submit`)
- **OTA Updates** - Using `expo-updates` in production
- **Tunneling** - Using `expo start --tunnel` for remote access
- **Analytics** - If you want Expo's analytics features

## 🚫 How to Skip Login

If you're just doing local development, you can:

1. **Press `Ctrl+C`** when prompted to login
2. **Use `--offline` flag**: `expo start --offline`
3. **Remove EAS config** from `app.json` (already done)
4. **Remove expo-updates** if you don't need OTA updates

## 📝 Current Setup

Your `app.json` has been updated to remove placeholder EAS configuration. This should prevent login prompts during local development.

If you need EAS features later:
1. Run `eas login` to authenticate
2. Run `eas build:configure` to set up EAS
3. Add your project ID back to `app.json`

## 💡 Recommendation

For now, **skip the login** - you don't need it for local development with Expo Go. Only login when you're ready to:
- Build production apps
- Deploy to app stores
- Use OTA updates in production
