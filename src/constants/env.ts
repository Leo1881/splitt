import Constants from "expo-constants";

// Environment variables using expo-constants
export const ENV = {
  // Azure Vision API
  AZURE_VISION_API_KEY:
    Constants.expoConfig?.extra?.azureVisionApiKey ||
    process.env.EXPO_PUBLIC_AZURE_VISION_API_KEY ||
    "",
  AZURE_VISION_ENDPOINT:
    Constants.expoConfig?.extra?.azureVisionEndpoint ||
    process.env.EXPO_PUBLIC_AZURE_VISION_ENDPOINT ||
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
