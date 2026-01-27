import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Note: expo-image-manipulator can be installed later for advanced cropping
// For now, this screen lets users review and proceed with the image
import { Button } from "../components/Button";
import { theme } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

interface CropImageScreenProps {
  imageUri: string;
  onCropComplete: (croppedImageUri: string) => void;
  onBack: () => void;
}

export const CropImageScreen: React.FC<CropImageScreenProps> = ({
  imageUri,
  onCropComplete,
  onBack,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropRegion, setCropRegion] = useState({
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  });

  const handleCrop = async () => {
    // For now, just proceed with the image
    // TODO: Add expo-image-manipulator for image optimization
    // This helps reduce noise and improve OCR accuracy
    onCropComplete(imageUri);
  };

  const handleSkip = () => {
    // User can skip cropping and use original image
    onCropComplete(imageUri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Crop Receipt</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          <View style={styles.overlay}>
            <View style={styles.cropGuide}>
              <Text style={styles.guideText}>
                Position the receipt within the frame
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            💡 Tip: Make sure the receipt is clearly visible and well-lit
          </Text>
          <Text style={styles.instructionText}>
            The image will be optimized for better OCR accuracy
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Skip Cropping"
          onPress={handleSkip}
          variant="outline"
          size="medium"
          style={styles.skipButton}
        />
        <Button
          title={isProcessing ? "Processing..." : "Optimize & Continue"}
          onPress={handleCrop}
          variant="primary"
          size="large"
          style={styles.continueButton}
          disabled={isProcessing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  imageContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    backgroundColor: theme.colors.backgroundSecondary,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cropGuide: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  guideText: {
    ...theme.typography.body,
    color: "white",
    textAlign: "center",
  },
  instructions: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  instructionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  actions: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  skipButton: {
    marginBottom: theme.spacing.xs,
  },
  continueButton: {
    marginTop: theme.spacing.xs,
  },
});
