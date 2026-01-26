# Best Practices Setup Guide

This document outlines all the best practices that have been implemented in your Splitt app.

## ✅ Implemented Features

### 1. Code Quality Tools

#### Prettier

- **Config**: `.prettierrc`
- **Usage**: `npm run format` to format all files
- **Check**: `npm run format:check` to check formatting

#### ESLint

- **Config**: `.eslintrc.js`
- **Usage**: `npm run lint` to check for errors
- **Fix**: `npm run lint:fix` to auto-fix issues

### 2. Error Tracking

#### Sentry

- **Location**: `src/utils/sentry.ts`
- **Setup**: Add your Sentry DSN to `.env`:
  ```
  EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
  ```
- **Usage**: Already integrated in `App.tsx`
- **Error Boundary**: `src/components/ErrorBoundary.tsx` wraps the app

### 3. Testing

#### Jest + React Native Testing Library

- **Config**: `jest.config.js`
- **Usage**: `npm test` to run tests
- **Watch**: `npm run test:watch` for watch mode
- **Example Test**: `src/__tests__/Button.test.tsx`

### 4. State Management

#### Zustand

- **Location**: `src/store/useAppStore.ts`
- **Usage**:

  ```typescript
  import { useAppStore } from "../store/useAppStore";

  const { payees, setPayees } = useAppStore();
  ```

### 5. Validation

#### Zod

- **Location**: `src/utils/validation.ts`
- **Schemas Available**:
  - `payeeSchema`
  - `receiptItemSchema`
  - `currencySchema`
  - `restaurantNameSchema`
  - `tipSchema`
  - `extractedReceiptDataSchema`
- **Usage**:

  ```typescript
  import { validateAndParse, payeeSchema } from "../utils/validation";

  const result = validateAndParse(payeeSchema, data);
  if (result.success) {
    // Use result.data
  } else {
    // Handle result.error
  }
  ```

### 6. Environment Variables

#### expo-constants

- **Location**: `src/constants/env.ts`
- **Usage**:

  ```typescript
  import { ENV, IS_DEV, IS_PRODUCTION } from "../constants/env";

  const apiKey = ENV.AZURE_VISION_API_KEY;
  ```

### 7. Image Optimization

#### expo-image

- **Installed**: Ready to use
- **Usage**: Replace `Image` with `expo-image`:

  ```typescript
  import { Image } from 'expo-image';

  <Image source={{ uri: '...' }} />
  ```

### 8. Animations

#### react-native-reanimated

- **Installed**: Ready to use
- **Usage**: Import and use for performant animations
  ```typescript
  import Animated, {
    useSharedValue,
    withSpring,
  } from "react-native-reanimated";
  ```

### 9. Security

#### react-native-encrypted-storage

- **Installed**: Ready to use
- **Usage**: For storing sensitive data

  ```typescript
  import EncryptedStorage from "react-native-encrypted-storage";

  await EncryptedStorage.setItem("token", "value");
  const token = await EncryptedStorage.getItem("token");
  ```

### 10. Internationalization

#### expo-localization

- **Installed**: Plugin added to `app.json`
- **Usage**:

  ```typescript
  import * as Localization from "expo-localization";

  const locale = Localization.locale;
  ```

### 11. Deep Linking

#### expo-linking

- **Installed**: Ready to use
- **Usage**: For handling deep links and URLs

  ```typescript
  import * as Linking from "expo-linking";

  const url = await Linking.getInitialURL();
  ```

### 12. OTA Updates

#### expo-updates

- **Installed**: Ready to use
- **Usage**: For over-the-air updates

  ```typescript
  import * as Updates from "expo-updates";

  if (Updates.isAvailable) {
    await Updates.reloadAsync();
  }
  ```

## 📝 Next Steps

### 1. Configure Sentry

1. Create a Sentry account at https://sentry.io
2. Create a new project
3. Get your DSN
4. Add to `.env`:
   ```
   EXPO_PUBLIC_SENTRY_DSN=your-dsn-here
   ```
5. Update `app.json` with your Sentry org and project slugs

### 2. Set Up EAS (Expo Application Services)

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Update `app.json` with your project ID

### 3. Format Existing Code

```bash
npm run format
```

### 4. Run Linter

```bash
npm run lint:fix
```

### 5. Write Tests

Start writing tests for your components in `src/__tests__/`

### 6. Migrate to Zustand (Optional)

You can gradually migrate from useState to Zustand using `useAppStore`

## 🎯 Best Practices Checklist

- ✅ Prettier configured
- ✅ ESLint configured
- ✅ Sentry setup (needs DSN)
- ✅ Jest + Testing Library installed
- ✅ Zustand store created
- ✅ Zod validation schemas
- ✅ Error boundary component
- ✅ Environment variables helper
- ✅ All recommended Expo modules installed

## 📚 Documentation Links

- [Prettier](https://prettier.io/docs/en/)
- [ESLint](https://eslint.org/docs/latest/)
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)
- [Jest](https://jestjs.io/docs/getting-started)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev/)
- [Expo Constants](https://docs.expo.dev/versions/latest/sdk/constants/)
- [Expo Updates](https://docs.expo.dev/versions/latest/sdk/updates/)

## ⚠️ Important Notes

1. **Sentry**: Only works in production builds, not in Expo Go
2. **Testing**: Some packages may have peer dependency warnings (React 19), but should work
3. **Formatting**: Run `npm run format` before committing
4. **Linting**: Fix linting errors before committing
5. **Environment Variables**: Use `EXPO_PUBLIC_` prefix for client-side variables

## 🚀 Quick Commands

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```
