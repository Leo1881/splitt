import React, { useEffect, useCallback } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { theme } from "../constants/theme";

const lottieAnimation = require("../../assets/splittlottie.json");

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { width, height } = useWindowDimensions();
  // Lottie file is 1200x900 (4:3 aspect ratio)
  const aspectRatio = 1200 / 900; // 1.333...
  const maxWidth = Math.min(width * 0.8, 600);
  const lottieWidth = maxWidth;
  const lottieHeight = lottieWidth / aspectRatio;
  const leftOffset = (width - lottieWidth) / 2;

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Fallback in case onAnimationFinish doesn't fire
    // Animation is 300 frames at 100fps = 3 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [handleComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={lottieAnimation}
        autoPlay
        loop={false}
        resizeMode="contain"
        style={[
          styles.lottie,
          {
            width: lottieWidth,
            height: lottieHeight,
            left: leftOffset,
            top: (height - lottieHeight) / 2,
          },
        ]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Splitt App Splash Screen"
        onAnimationFinish={handleComplete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  lottie: {
    position: "absolute",
  },
});
