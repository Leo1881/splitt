# Splitt - React Native Mobile App

A modern React Native mobile application built with Expo, TypeScript, and React Navigation.

## 🚀 Features

- **Modern Architecture**: Built with React Native, TypeScript, and Expo
- **Navigation**: React Navigation with bottom tabs and stack navigation
- **UI Components**: Custom reusable components with consistent theming
- **TypeScript**: Full TypeScript support for better development experience
- **Responsive Design**: Optimized for both iOS and Android

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Run on specific platforms:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── constants/      # Theme, colors, and constants
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## 🎨 Design System

The app includes a comprehensive design system with:

- Consistent color palette
- Typography scale
- Spacing system
- Component variants
- Dark mode support (ready for implementation)

## 🛠️ Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation in `src/navigation/AppNavigator.tsx`
3. Update the types in `src/types/index.ts` if needed

### Adding New Components

1. Create component files in `src/components/`
2. Export from `src/components/index.ts`
3. Use the theme system for consistent styling

## 📦 Dependencies

- **Navigation**: React Navigation v7
- **Icons**: Expo Vector Icons
- **UI**: React Native Paper
- **Safe Areas**: React Native Safe Area Context
- **Gestures**: React Native Gesture Handler

## 🚀 Deployment

This project is ready for deployment to:

- App Store (iOS)
- Google Play Store (Android)
- Web deployment via Expo

## 📄 License

This project is private and proprietary.
