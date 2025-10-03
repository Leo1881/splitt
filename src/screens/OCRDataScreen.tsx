import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { theme } from "../constants/theme";

interface OCRDataScreenProps {
  extractedData: any;
  onContinue: () => void;
  onBack?: () => void;
}

export const OCRDataScreen: React.FC<OCRDataScreenProps> = ({
  extractedData,
  onContinue,
  onBack,
}) => {
  const handleContinue = () => {
    onContinue();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OCR Data Extracted</Text>
        <Text style={styles.subtitle}>
          Here's what we found in your receipt
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Restaurant Name:</Text>
            <Text style={styles.infoValue}>
              {extractedData?.restaurantName || "Not found"}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {extractedData?.date
                ? new Date(extractedData.date).toLocaleDateString()
                : "Not found"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Items Found ({extractedData?.items?.length || 0})
          </Text>
          {extractedData?.items?.map((item: any, index: number) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                ${extractedData?.subtotal?.toFixed(2) || "0.00"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax:</Text>
              <Text style={styles.summaryValue}>
                ${extractedData?.tax?.toFixed(2) || "0.00"}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                ${extractedData?.total?.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raw OCR Text</Text>
          <View style={styles.rawTextCard}>
            <Text style={styles.rawText}>
              {extractedData?.rawText || "No raw text available"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
        )}
        <Button
          title="Continue to Assign Items"
          onPress={handleContinue}
          variant="primary"
          size="large"
          style={styles.continueButton}
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  itemCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  itemQuantity: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  itemPrice: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  summaryValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  totalLabel: {
    ...theme.typography.h4,
    color: theme.colors.text,
    fontWeight: "700",
  },
  totalValue: {
    ...theme.typography.h4,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  rawTextCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  rawText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  backButton: {
    width: 71,
    height: 71,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: "900",
    margin: 0,
    padding: 0,
  },
  continueButton: {
    flex: 1,
  },
});
