# Splitt App - Tech Stack Overview

## 🎯 Core Framework & Runtime

### React Native & Expo

- **Expo SDK**: `^54.0.12` - Managed workflow for React Native
- **React Native**: `0.81.4` - Cross-platform mobile framework
- **React**: `19.1.0` - UI library (latest version)
- **React DOM**: `19.1.0` - For web support
- **New Architecture**: Enabled (`newArchEnabled: true`)

### TypeScript

- **TypeScript**: `~5.9.2` - Type-safe JavaScript
- **Strict Mode**: Enabled for better type safety
- **Config**: Extends Expo's base TypeScript config

---

## 🧭 Navigation

### React Navigation v7

- **@react-navigation/native**: `^7.1.17` - Core navigation library
- **@react-navigation/stack**: `^7.4.8` - Stack navigator
- **@react-navigation/bottom-tabs**: `^7.4.7` - Bottom tab navigator
- **react-native-screens**: `^4.16.0` - Native screen components
- **react-native-safe-area-context**: `^5.6.1` - Safe area handling
- **react-native-gesture-handler**: `^2.28.0` - Gesture recognition

---

## 🎨 UI & Design

### Component Libraries

- **react-native-paper**: `^5.14.5` - Material Design components
- **@expo/vector-icons**: `^15.0.2` - Icon library (Ionicons, MaterialIcons)
- **react-native-vector-icons**: `^10.3.0` - Additional icon support
- **react-native-portalize**: `^1.0.7` - Portal system for modals/overlays

### Design System

- Custom theme system with:
  - Color palette (primary, secondary, accent, etc.)
  - Typography scale (h1, h2, h3, body, caption, small)
  - Spacing system (xs, sm, md, lg, xl, xxl)
  - Border radius system
  - Dark mode support (prepared but not active)

---

## 📸 Media & Device Features

### Camera & Image

- **expo-camera**: `~17.0.8` - Camera access and photo capture
- **expo-image-picker**: `^17.0.8` - Image selection from gallery
- **QR Code Scanning**: Built-in via expo-camera barcode scanner

### File System

- **expo-file-system**: `~19.0.16` - File system operations
- **expo-clipboard**: `~8.0.7` - Clipboard operations

---

## 📄 Document Generation

### PDF & Sharing

- **expo-print**: `~15.0.7` - PDF generation from HTML
- **expo-sharing**: `~14.0.7` - Native sharing functionality

---

## 🔧 Development Tools

### Build & Development

- **Expo CLI**: Development server and build tools
- **Metro Bundler**: JavaScript bundler
- **@expo/ngrok**: `^4.1.3` - Tunneling for development (dev dependency)

### Type Definitions

- **@types/react**: `~19.1.0` - React type definitions

---

## 🌐 Platform Support

### Multi-Platform

- **iOS**: Full support with camera permissions
- **Android**: Full support with edge-to-edge enabled
- **Web**: `react-native-web` `^0.21.0` - Web platform support

---

## 🔐 Permissions & Configuration

### iOS

- Camera permission (`NSCameraUsageDescription`)
- Tablet support enabled

### Android

- Camera permission
- Edge-to-edge display enabled
- Predictive back gesture disabled
- Package: `com.anonymous.splitt`

---

## 📦 Project Structure

```
splitt/
├── src/
│   ├── components/      # Reusable UI components (Button, Card)
│   ├── screens/          # Screen components (11 screens)
│   ├── navigation/       # Navigation configuration
│   ├── constants/        # Theme, colors, currencies
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions (OCR, PDF generation)
├── assets/               # Images, icons, fonts
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

---

## 🚀 Key Features Enabled

1. **New Architecture**: React Native's new architecture enabled
2. **Strict TypeScript**: Full type safety
3. **Multi-platform**: iOS, Android, and Web support
4. **Camera Integration**: Receipt scanning with OCR
5. **PDF Generation**: Bill splitting summaries
6. **Modern React**: Using React 19 (latest)

---

## 📊 Dependency Summary

### Production Dependencies: 23

- Core: React, React Native, Expo
- Navigation: React Navigation suite
- UI: Paper, Vector Icons
- Media: Camera, Image Picker
- Utils: File System, Print, Sharing

### Development Dependencies: 3

- TypeScript
- React types
- ngrok (for tunneling)

---

## ⚠️ Notes & Considerations

1. **React 19**: Using the latest React version (may have compatibility considerations)
2. **New Architecture**: Enabled but may need native modules compatibility check
3. **No State Management**: Currently using React hooks (useState) - consider Context API or Redux for complex state
4. **No Testing Framework**: No Jest, React Native Testing Library, etc.
5. **No Linting**: Consider adding ESLint and Prettier
6. **No Error Tracking**: Consider Sentry or similar for production
7. **No Analytics**: Consider adding analytics for user behavior

---

## 🔄 Potential Upgrades/Additions

### Recommended Additions

- **State Management**: Redux Toolkit or Zustand
- **Testing**: Jest + React Native Testing Library
- **Linting**: ESLint + Prettier
- **Error Tracking**: Sentry
- **Analytics**: Firebase Analytics or Mixpanel
- **Backend**: Supabase, Firebase, or custom API
- **Authentication**: Expo AuthSession or Firebase Auth
- **Storage**: AsyncStorage or Expo SecureStore
- **Forms**: React Hook Form
- **Date Handling**: date-fns or dayjs

---

## 📱 Build & Deployment

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser

### Deployment Targets

- App Store (iOS)
- Google Play Store (Android)
- Web (via Expo)

---

**Last Updated**: Based on current package.json and app.json configuration
