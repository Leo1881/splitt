import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { theme } from "../constants/theme";

export const HomeScreen: React.FC = () => {
  const handleGetStarted = () => {
    console.log("Get Started pressed");
  };

  const handleLearnMore = () => {
    console.log("Learn More pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Splitt</Text>
          <Text style={styles.subtitle}>
            Your modern mobile app is ready to go!
          </Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.featureCard}>
            <Text style={styles.featureTitle}>🚀 Modern Architecture</Text>
            <Text style={styles.featureDescription}>
              Built with React Native, TypeScript, and Expo for the best
              development experience.
            </Text>
          </Card>

          <Card style={styles.featureCard}>
            <Text style={styles.featureTitle}>🎨 Beautiful UI</Text>
            <Text style={styles.featureDescription}>
              Pre-configured with a modern design system and responsive
              components.
            </Text>
          </Card>

          <Card style={styles.featureCard}>
            <Text style={styles.featureTitle}>⚡ Performance</Text>
            <Text style={styles.featureDescription}>
              Optimized for smooth animations and fast loading times.
            </Text>
          </Card>
        </View>

        <View style={styles.actions}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={styles.primaryButton}
          />
          <Button
            title="Learn More"
            onPress={handleLearnMore}
            variant="outline"
            size="large"
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  content: {
    flex: 1,
    marginBottom: theme.spacing.xl,
  },
  featureCard: {
    marginBottom: theme.spacing.lg,
  },
  featureTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  featureDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    gap: theme.spacing.md,
  },
  primaryButton: {
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {
    marginBottom: theme.spacing.lg,
  },
});
