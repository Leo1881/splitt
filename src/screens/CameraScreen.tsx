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
  const [showCamera, setShowCamera] = useState(true);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Receipt</Text>
        <Text style={styles.subtitle}>
          {showCamera
            ? "Position the receipt within the frame and tap to capture"
            : "Choose a receipt photo from your gallery"}
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        {showCamera ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            mode="picture"
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

        {showCamera && (
          <View style={styles.cameraOverlay}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.leftControl}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              if (showCamera) {
                setShowCamera(false);
              } else {
                setShowCamera(true);
              }
            }}
          >
            <MaterialIcons
              name={showCamera ? "photo-library" : "camera-alt"}
              size={24}
              color="white"
            />
            <Text style={styles.toggleText}>
              {showCamera ? "Gallery" : "Camera"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.captureButton, isCapturing && styles.capturingButton]}
          onPress={showCamera ? takePicture : pickImageFromGallery}
          disabled={isCapturing}
        >
          <MaterialIcons
            name={
              isCapturing
                ? "hourglass-empty"
                : showCamera
                ? "camera-alt"
                : "photo-library"
            }
            size={32}
            color="white"
          />
        </TouchableOpacity>

        <View style={styles.rightControl}>
          {showCamera && (
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
  cameraContainer: {
    flex: 1,
    margin: theme.spacing.lg,
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
    top: "30%",
    left: "20%",
  },
  topRight: {
    top: "30%",
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  leftControl: {
    flex: 1,
    alignItems: "flex-start",
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
    width: 100,
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
  backButton: {
    marginTop: theme.spacing.sm,
  },
});
