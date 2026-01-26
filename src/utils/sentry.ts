import { Platform } from "react-native";

// Only import Sentry on native platforms (not web)
let Sentry: any = null;
if (Platform.OS !== "web") {
  try {
    Sentry = require("@sentry/react-native");
  } catch (e) {
    // Sentry not available
  }
}

// Initialize Sentry (call this in App.tsx or index.ts)
export const initSentry = () => {
  // Don't initialize Sentry on web or in development
  if (Platform.OS === "web" || __DEV__) {
    if (__DEV__) {
      console.log("Sentry disabled in development mode");
    }
    return;
  }

  if (!Sentry) {
    return;
  }

  try {
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
      enableInExpoDevelopment: false,
      debug: false,
      // Set environment
      environment: process.env.EXPO_PUBLIC_ENV || "production",
    });
  } catch (error) {
    console.warn("Failed to initialize Sentry:", error);
  }
};

// Error boundary component wrapper (only available on native)
export const SentryErrorBoundary = Platform.OS !== "web" && Sentry?.Native?.ErrorBoundary
  ? Sentry.Native.ErrorBoundary
  : null;

// Helper to capture exceptions
export const captureException = (
  error: Error,
  context?: Record<string, unknown>
) => {
  if (__DEV__ || Platform.OS === "web") {
    console.error("Error:", error, context);
    return;
  }

  if (Sentry) {
    try {
      Sentry.captureException(error, {
        extra: context,
      });
    } catch (e) {
      console.error("Failed to capture exception in Sentry:", e);
    }
  }
};

// Helper to capture messages
export const captureMessage = (
  message: string,
  level: "info" | "warning" | "error" | "fatal" | "debug" = "info"
) => {
  if (__DEV__ || Platform.OS === "web") {
    console.log(`[${level.toUpperCase()}]`, message);
    return;
  }

  if (Sentry) {
    try {
      Sentry.captureMessage(message, level);
    } catch (e) {
      console.error("Failed to capture message in Sentry:", e);
    }
  }
};
