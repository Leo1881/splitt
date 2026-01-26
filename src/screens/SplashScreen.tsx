import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { theme } from "../constants/theme";

const logoLight = require("../../assets/logo_light.png");

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_DURATION = 2000;
const ANIMATION_DURATION = 800;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      handleComplete();
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, handleComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Splitt App Splash Screen"
      >
        <View style={styles.logoContainer}>
          <Image
            source={logoLight}
            style={styles.logo}
            contentFit="contain"
            accessible={true}
            accessibilityLabel="Splitt logo"
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
  },
});
