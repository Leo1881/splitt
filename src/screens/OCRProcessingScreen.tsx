import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { theme } from "../constants/theme";
import {
  extractTextFromImage,
  parseReceiptText,
} from "../utils/googleVisionAPI";
import { ExtractedReceiptData } from "../types";
import { captureException } from "../utils/sentry";
import {
  validateAndParse,
  extractedReceiptDataSchema,
} from "../utils/validation";

const STEP_DELAY_MS = 500;
const FINAL_STEP_DELAY_MS = 300;

interface OCRProcessingScreenProps {
  imageUri: string;
  onProcessingComplete: (extractedData: ExtractedReceiptData) => void;
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

  const handleProcessingComplete = useCallback(
    (data: ExtractedReceiptData) => {
      // Validate extracted data before passing it on
      const validation = validateAndParse(extractedReceiptDataSchema, data);
      if (validation.success) {
        onProcessingComplete(validation.data);
      } else {
        // If validation fails, still pass the data but log the error
        captureException(new Error("Invalid extracted receipt data"), {
          validationError: validation.error,
          data,
        });
        onProcessingComplete(data);
      }
    },
    [onProcessingComplete]
  );

  useEffect(() => {
    const processReceipt = async () => {
      try {
        // Check if this is QR data instead of an image
        if (imageUri.startsWith("qr-data:")) {
          const qrData = imageUri.replace("qr-data:", "");

          // Create mock receipt data for QR codes
          const extractedData: ExtractedReceiptData = {
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
          await new Promise((resolve) => setTimeout(resolve, STEP_DELAY_MS));

          handleProcessingComplete(extractedData);
          return;
        }

        // Step 1: Analyzing receipt image
        setProcessingStep(0);
        setProgress(20);
        await new Promise((resolve) => setTimeout(resolve, STEP_DELAY_MS));

        // Step 2: Extracting text from receipt using Azure Vision API
        setProcessingStep(1);
        setProgress(40);

        const ocrResult = await extractTextFromImage(imageUri);

        if (!ocrResult.success) {
          throw new Error(ocrResult.error || "OCR processing failed");
        }

        // Step 3: Parsing receipt data
        setProcessingStep(2);
        setProgress(60);
        await new Promise((resolve) => setTimeout(resolve, STEP_DELAY_MS));

        // Step 4: Identifying items and prices
        setProcessingStep(3);
        setProgress(80);

        // Parse the extracted text into structured data
        const extractedData = parseReceiptText(ocrResult.text);

        // Step 5: Finalizing results
        setProcessingStep(4);
        setProgress(100);
        await new Promise((resolve) =>
          setTimeout(resolve, FINAL_STEP_DELAY_MS)
        );

        // Complete processing with real OCR data
        handleProcessingComplete(extractedData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        captureException(
          error instanceof Error ? error : new Error(errorMessage),
          { context: "OCRProcessing", imageUri }
        );

        // Fallback to mock data if OCR fails
        const fallbackData: ExtractedReceiptData = {
          restaurantName: "OCR Processing Failed",
          items: [{ name: "Please try again", price: 0, quantity: 1 }],
          subtotal: 0,
          tax: 0,
          total: 0,
          date: new Date().toISOString(),
          rawText: `OCR processing failed: ${errorMessage}. Please try taking a clearer photo.`,
        };
        handleProcessingComplete(fallbackData);
      }
    };

    processReceipt();
  }, [imageUri, handleProcessingComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Processing Receipt</Text>
        <Text style={styles.subtitle}>
          We're analyzing your receipt to extract the items and prices
        </Text>
      </View>

      <View style={styles.imageContainer}>
        {!imageUri.startsWith("qr-data:") && (
          <Image
            source={{ uri: imageUri }}
            style={styles.receiptImage}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Receipt image being processed"
          />
        )}
        <View style={styles.imageOverlay}>
          <MaterialIcons name="receipt" size={40} color="white" />
        </View>
      </View>

      <View style={styles.processingContainer}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          accessibilityLabel="Processing receipt"
        />

        <View style={styles.stepContainer}>
          <Text
            style={styles.currentStep}
            accessibilityLiveRegion="polite"
            accessibilityLabel={`Processing step: ${processingSteps[processingStep]}`}
          >
            {processingSteps[processingStep]}
          </Text>

          <View
            style={styles.progressBar}
            accessibilityRole="progressbar"
            accessibilityValue={{
              min: 0,
              max: 100,
              now: progress,
              text: `${Math.round(progress)}% complete`,
            }}
          >
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
          <Button
            title="Go Back"
            onPress={onBack}
            variant="outline"
            accessibilityLabel="Go back to camera screen"
          />
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
