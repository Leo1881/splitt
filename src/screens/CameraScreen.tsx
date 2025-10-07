import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { theme } from "../constants/theme";

interface CameraScreenProps {
  onPhotoTaken: (photoUri: string) => void;
  onBack?: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  onPhotoTaken,
  onBack,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isCapturing, setIsCapturing] = useState(false);
  const [mode, setMode] = useState<"camera" | "gallery" | "qr">("camera");
  const [showCaptureOptions, setShowCaptureOptions] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
          {onBack && (
            <Button
              title="Go Back"
              onPress={onBack}
              variant="outline"
              style={styles.backButton}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (photo?.uri) {
          onPhotoTaken(photo.uri);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
        console.error("Camera error:", error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoTaken(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery");
      console.error("Image picker error:", error);
    }
  };

  const handleQRCodeScanned = ({ data }: { data: string }) => {
    console.log("QR Code detected:", data);

    // Process QR data based on content type
    if (data.startsWith("http")) {
      // URL - could be receipt link
      Alert.alert(
        "QR Code Detected",
        `Receipt URL: ${data}\n\nWould you like to process this receipt?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Process", onPress: () => processQRReceipt(data) },
        ]
      );
    } else if (data.startsWith("{")) {
      // JSON data - parse directly
      try {
        const receiptData = JSON.parse(data);
        Alert.alert("QR Code Detected", "Receipt data found! Processing...");
        processQRReceipt(data);
      } catch (error) {
        Alert.alert("Error", "Invalid QR code data format");
      }
    } else {
      // Plain text - could be receipt info
      Alert.alert(
        "QR Code Detected",
        `Text: ${data}\n\nWould you like to process this as receipt data?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Process", onPress: () => processQRReceipt(data) },
        ]
      );
    }
  };

  const processQRReceipt = (data: string) => {
    // For now, we'll treat QR data as a "photo" and let the OCR system handle it
    // In the future, this could be enhanced to parse QR data directly
    console.log("Processing QR receipt data:", data);

    // Create a mock image URI for QR data
    const qrDataUri = `data:text/plain;base64,${Buffer.from(data).toString(
      "base64"
    )}`;
    onPhotoTaken(qrDataUri);
  };

  const selectMode = (selectedMode: "camera" | "gallery" | "qr") => {
    setMode(selectedMode);
    setShowCaptureOptions(false); // Hide FAB after selection
  };

  const toggleCaptureOptions = () => {
    setShowCaptureOptions(!showCaptureOptions);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === "qr" ? "Scan QR Code" : "Scan Receipt"}
        </Text>
        <Text style={styles.subtitle}>
          {mode === "qr"
            ? "Point your camera at a QR code to scan receipt data"
            : mode === "camera"
            ? "Position the receipt within the frame and tap to capture"
            : "Choose a receipt photo from your gallery"}
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        {mode !== "gallery" ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            mode="picture"
            barcodeScannerSettings={
              mode === "qr"
                ? {
                    barcodeTypes: ["qr", "pdf417"],
                  }
                : undefined
            }
            onBarcodeScanned={mode === "qr" ? handleQRCodeScanned : undefined}
          />
        ) : (
          <TouchableOpacity
            style={styles.galleryPlaceholder}
            onPress={pickImageFromGallery}
          >
            <MaterialIcons
              name="photo-library"
              size={80}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.galleryText}>Tap to select from gallery</Text>
          </TouchableOpacity>
        )}

        {mode !== "gallery" && (
          <View style={styles.cameraOverlay}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        )}

        {/* FAB Overlay - appears when capture options are shown */}
        {showCaptureOptions && (
          <View style={styles.fabOverlay}>
            <View style={styles.fabContainer}>
              <TouchableOpacity
                style={[
                  styles.fabButton,
                  mode === "camera" && styles.fabButtonActive,
                ]}
                onPress={() => selectMode("camera")}
              >
                <MaterialIcons name="camera-alt" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.fabButton,
                  mode === "gallery" && styles.fabButtonActive,
                ]}
                onPress={() => selectMode("gallery")}
              >
                <MaterialIcons name="photo-library" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.fabButton,
                  mode === "qr" && styles.fabButtonActive,
                ]}
                onPress={() => selectMode("qr")}
              >
                <MaterialIcons name="qr-code-scanner" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.leftControl}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={toggleCaptureOptions}
          >
            <MaterialIcons name="cloud-upload" size={24} color="white" />
            <Text style={styles.captureText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centerControl}>
          <TouchableOpacity
            style={[
              styles.mainCaptureButton,
              isCapturing && styles.capturingButton,
            ]}
            onPress={
              mode === "gallery"
                ? pickImageFromGallery
                : mode === "qr"
                ? undefined
                : takePicture
            }
            disabled={isCapturing || mode === "qr"}
          >
            <MaterialIcons
              name={
                isCapturing
                  ? "hourglass-empty"
                  : mode === "qr"
                  ? "qr-code-scanner"
                  : mode === "gallery"
                  ? "photo-library"
                  : "camera-alt"
              }
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rightControl}>
          {mode === "camera" && (
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <MaterialIcons
                name="flip-camera-android"
                size={24}
                color="white"
              />
              <Text style={styles.flipText}>Flip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {onBack && (
        <View style={styles.backContainer}>
          <Button
            title="Go Back"
            onPress={onBack}
            variant="outline"
            style={styles.backButton}
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
    padding: theme.spacing.md,
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
  cameraContainer: {
    flex: 1,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: theme.colors.primary,
    borderWidth: 3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: "20%",
    left: "20%",
  },
  topRight: {
    top: "20%",
    right: "20%",
    left: "auto",
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    top: "70%",
    left: "20%",
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    top: "70%",
    right: "20%",
    left: "auto",
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 4,
  },
  leftControl: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerControl: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightControl: {
    flex: 1,
    alignItems: "flex-end",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    width: 100,
  },
  modeButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  activeModeButton: {
    backgroundColor: "rgba(0, 109, 119, 0.8)",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modeOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeModeOption: {
    backgroundColor: "rgba(0, 109, 119, 0.8)",
  },
  collapseButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  modeText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  modeOptionText: {
    color: "white",
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "500",
  },
  toggleText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  flipText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    width: 110,
  },
  galleryPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  galleryText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontWeight: "500",
  },
  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    width: 110,
  },
  captureText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  fabOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },
  fabContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  fabButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  mainCaptureButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  capturingButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  placeholder: {
    width: 48,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  permissionText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  permissionButton: {
    marginBottom: theme.spacing.md,
  },
  backContainer: {
    padding: theme.spacing.lg,
  },
  backButton: {},
});
