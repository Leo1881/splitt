import Constants from "expo-constants";

// Environment variables using expo-constants
export const ENV = {
  // Google Vision API
  GOOGLE_VISION_API_KEY:
    Constants.expoConfig?.extra?.googleVisionApiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY ||
    "",

  // Sentry
  SENTRY_DSN:
    Constants.expoConfig?.extra?.sentryDsn ||
    process.env.EXPO_PUBLIC_SENTRY_DSN ||
    "",

  // Environment
  ENV:
    Constants.expoConfig?.extra?.env ||
    process.env.EXPO_PUBLIC_ENV ||
    "development",

  // App Info
  APP_VERSION: Constants.expoConfig?.version || "1.0.0",
  APP_NAME: Constants.expoConfig?.name || "splitt",
} as const;

// Check if we're in development
export const IS_DEV = __DEV__;
export const IS_PRODUCTION = !__DEV__;
