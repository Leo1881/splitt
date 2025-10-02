import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { theme } from "../constants/theme";
import { Currency } from "../constants/currencies";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MockReceiptScreenProps {
  currency: Currency;
  restaurantName: string;
  onContinue: (items: ReceiptItem[]) => void;
  onBack?: () => void;
}

// Mock receipt data for testing
const mockReceiptData: ReceiptItem[] = [
  { id: "1", name: "Margherita Pizza", price: 18.5, quantity: 1 },
  { id: "2", name: "Caesar Salad", price: 12.0, quantity: 1 },
  { id: "3", name: "Beer", price: 30.0, quantity: 5 },
  { id: "4", name: "Tiramisu", price: 8.0, quantity: 1 },
  { id: "5", name: "Cappuccino", price: 4.5, quantity: 1 },
  { id: "6", name: "Chicken Wings", price: 14.0, quantity: 1 },
];

export const MockReceiptScreen: React.FC<MockReceiptScreenProps> = ({
  currency,
  restaurantName,
  onContinue,
  onBack,
}) => {
  const subtotal = mockReceiptData.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleContinue = () => {
    onContinue(mockReceiptData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Receipt Scanned</Text>
          <Text style={styles.subtitle}>
            Here's what we found on your receipt
          </Text>
        </View>

        <Card style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>🍕 {restaurantName}</Text>
          <Text style={styles.receiptDate}>December 15, 2024 • 7:30 PM</Text>

          <View style={styles.itemsContainer}>
            {mockReceiptData.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.quantity > 1
                    ? `${item.name} x${item.quantity}`
                    : item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  {currency.symbol}
                  {item.price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {currency.symbol}
                {subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax (8%)</Text>
              <Text style={styles.totalValue}>
                {currency.symbol}
                {tax.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.finalTotalLabel}>Total</Text>
              <Text style={styles.finalTotalValue}>
                {currency.symbol}
                {total.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            💡 This is mock data for testing. In the real app, this would come
            from scanning your receipt.
          </Text>
        </View>

        <View style={styles.continueSection}>
          <View style={styles.buttonContainer}>
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
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  receiptCard: {
    marginBottom: theme.spacing.lg,
  },
  receiptTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  receiptDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  itemsContainer: {
    marginBottom: theme.spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemName: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  itemPrice: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalsContainer: {
    marginTop: theme.spacing.sm,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  totalLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  totalValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  finalTotalLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: "bold",
  },
  finalTotalValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  noteContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  noteText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  continueSection: {
    marginTop: "auto",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  continueButton: {
    flex: 1,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    width: 71, // Square: same as height
    height: 71, // Same height as continue button (including border)
    marginBottom: theme.spacing.lg,
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
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: "center",
    lineHeight: 28,
  },
});
