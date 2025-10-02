import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { theme } from "../constants/theme";

interface OCRProcessingScreenProps {
  imageUri: string;
  onProcessingComplete: (extractedData: any) => void;
  onBack?: () => void;
}

export const OCRProcessingScreen: React.FC<OCRProcessingScreenProps> = ({
  imageUri,
  onProcessingComplete,
  onBack,
}) => {
  const [processingStep, setProcessingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const processingSteps = [
    "Analyzing receipt image...",
    "Extracting text from receipt...",
    "Parsing receipt data...",
    "Identifying items and prices...",
    "Finalizing results...",
  ];

  useEffect(() => {
    // Simulate OCR processing steps
    const processReceipt = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i);
        setProgress((i / processingSteps.length) * 100);

        // Simulate processing time for each step
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Simulate final processing
      setProgress(100);

      // Mock extracted data for now
      const mockExtractedData = {
        restaurantName: "Sample Restaurant",
        items: [
          { name: "Burger", price: 12.99, quantity: 1 },
          { name: "Fries", price: 4.99, quantity: 1 },
          { name: "Drink", price: 2.99, quantity: 1 },
        ],
        subtotal: 20.97,
        tax: 1.68,
        total: 22.65,
        date: new Date().toISOString(),
      };

      // Complete processing
      setTimeout(() => {
        onProcessingComplete(mockExtractedData);
      }, 500);
    };

    processReceipt();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Processing Receipt</Text>
        <Text style={styles.subtitle}>
          We're analyzing your receipt to extract the items and prices
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.receiptImage} />
        <View style={styles.imageOverlay}>
          <MaterialIcons name="receipt" size={40} color="white" />
        </View>
      </View>

      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />

        <View style={styles.stepContainer}>
          <Text style={styles.currentStep}>
            {processingSteps[processingStep]}
          </Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.progressText}>
            {Math.round(progress)}% Complete
          </Text>
        </View>

        <View style={styles.stepsList}>
          {processingSteps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <MaterialIcons
                name={
                  index < processingStep
                    ? "check-circle"
                    : index === processingStep
                    ? "radio-button-checked"
                    : "radio-button-unchecked"
                }
                size={20}
                color={
                  index < processingStep
                    ? theme.colors.success
                    : index === processingStep
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.stepText,
                  {
                    color:
                      index <= processingStep
                        ? theme.colors.text
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {onBack && (
        <View style={styles.backContainer}>
          <Button title="Go Back" onPress={onBack} variant="outline" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  imageContainer: {
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  receiptImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  stepContainer: {
    width: "100%",
    marginTop: theme.spacing.xl,
  },
  currentStep: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  stepsList: {
    width: "100%",
    marginTop: theme.spacing.xl,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  stepText: {
    ...theme.typography.body,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  backContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
});
