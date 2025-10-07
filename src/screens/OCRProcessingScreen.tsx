import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { theme } from "../constants/theme";
import {
  extractTextFromImage,
  parseReceiptText,
} from "../utils/googleVisionAPI";

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
    const processReceipt = async () => {
      try {
        // Check if this is QR data instead of an image
        if (imageUri.startsWith("qr-data:")) {
          const qrData = imageUri.replace("qr-data:", "");
          console.log("Processing QR data:", qrData);

          // Create mock receipt data for QR codes
          const extractedData = {
            restaurantName: "QR Receipt",
            items: [{ name: "QR Code Item", price: 0, quantity: 1 }],
            subtotal: 0,
            tax: 0,
            total: 0,
            date: new Date().toISOString(),
            rawText: qrData,
          };

          setProcessingStep(4);
          setProgress(100);
          await new Promise((resolve) => setTimeout(resolve, 500));

          onProcessingComplete(extractedData);
          return;
        }

        // Step 1: Analyzing receipt image
        setProcessingStep(0);
        setProgress(20);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 2: Extracting text from receipt using Google Vision API
        setProcessingStep(1);
        setProgress(40);

        const ocrResult = await extractTextFromImage(imageUri);

        if (!ocrResult.success) {
          throw new Error(ocrResult.error || "OCR processing failed");
        }

        // Step 3: Parsing receipt data
        setProcessingStep(2);
        setProgress(60);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 4: Identifying items and prices
        setProcessingStep(3);
        setProgress(80);

        // Parse the extracted text into structured data
        const extractedData = parseReceiptText(ocrResult.text);

        // Step 5: Finalizing results
        setProcessingStep(4);
        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Complete processing with real OCR data
        onProcessingComplete(extractedData);
      } catch (error) {
        console.error("OCR Error:", error);
        // Fallback to mock data if OCR fails
        const fallbackData = {
          restaurantName: "OCR Processing Failed",
          items: [{ name: "Please try again", price: 0, quantity: 1 }],
          subtotal: 0,
          tax: 0,
          total: 0,
          date: new Date().toISOString(),
          rawText: `OCR processing failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }. Please try taking a clearer photo.`,
        };
        onProcessingComplete(fallbackData);
      }
    };

    processReceipt();
  }, [imageUri, onProcessingComplete]);

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
