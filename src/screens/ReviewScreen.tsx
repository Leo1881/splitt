import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { theme } from "../constants/theme";
import { shareBillPDF, BillData } from "../utils/pdfGenerator";
import { Payee, ReceiptItem, ItemAssignment } from "../types";
import { captureException } from "../utils/sentry";

interface ReviewScreenProps {
  items: ReceiptItem[];
  payees: Payee[];
  assignments: ItemAssignment[];
  tipAmount: number;
  subtotal: number;
  currency: {
    symbol: string;
    code: string;
  };
  restaurantName: string;
  onShare: () => void;
  onStartOver: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  items,
  payees,
  assignments,
  tipAmount,
  subtotal,
  currency,
  restaurantName,
  onShare,
  onStartOver,
}) => {
  const payeeTotals = useMemo(() => {
    const totals: {
      [key: string]: {
        name: string;
        subtotal: number;
        tip: number;
        total: number;
        items: Array<{
          name: string;
          quantity: number;
          amount: number;
        }>;
      };
    } = {};

    // Initialize payee totals
    payees.forEach((payee) => {
      totals[payee.id] = {
        name: payee.name,
        subtotal: 0,
        tip: 0,
        total: 0,
        items: [],
      };
    });

    // Calculate subtotals and items for each payee
    assignments.forEach((assignment) => {
      const item = items.find((i) => i.id === assignment.itemId);
      if (!item) return;

      if (assignment.isSplit && assignment.quantities) {
        // Split with specific quantities
        assignment.payees.forEach((payee) => {
          const quantity = assignment.quantities![payee.id] || 0;
          if (quantity > 0) {
            const pricePerUnit = item.price / item.quantity;
            const amount = quantity * pricePerUnit;
            totals[payee.id].subtotal += amount;
            totals[payee.id].items.push({
              name: item.quantity > 1 ? `${item.name} x${quantity}` : item.name,
              quantity,
              amount,
            });
          }
        });
      } else if (assignment.isSplit) {
        // Equal split
        const pricePerPerson = item.price / assignment.payees.length;
        assignment.payees.forEach((payee) => {
          totals[payee.id].subtotal += pricePerPerson;
          totals[payee.id].items.push({
            name:
              item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name,
            quantity: 1,
            amount: pricePerPerson,
          });
        });
      } else if (assignment.payees.length > 0) {
        // Single assignment
        const payee = assignment.payees[0];
        totals[payee.id].subtotal += item.price;
        totals[payee.id].items.push({
          name:
            item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name,
          quantity: item.quantity,
          amount: item.price,
        });
      }
    });

    // Calculate tip per person
    const tipPerPerson = payees.length > 0 ? tipAmount / payees.length : 0;
    Object.keys(totals).forEach((payeeId) => {
      totals[payeeId].tip = tipPerPerson;
      totals[payeeId].total = totals[payeeId].subtotal + totals[payeeId].tip;
    });

    return totals;
  }, [items, assignments, payees, tipAmount]);

  const total = subtotal + tipAmount;

  const handleSharePDF = useCallback(async () => {
    try {
      const tipPercentage =
        subtotal > 0 ? Math.round((tipAmount / subtotal) * 100) : 0;

      const billData: BillData = {
        restaurantName: restaurantName,
        currency: currency,
        subtotal: subtotal,
        tipAmount: tipAmount,
        tipPercentage: tipPercentage,
        total: total,
        payees: payees,
        items: items,
        assignments: assignments,
      };

      await shareBillPDF(billData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      captureException(
        error instanceof Error ? error : new Error(errorMessage),
        { context: "handleSharePDF" }
      );
      Alert.alert(
        "Share Failed",
        "Failed to generate PDF. Please try again or use the share button."
      );
      // Fallback to original onShare if PDF fails
      onShare();
    }
  }, [
    subtotal,
    tipAmount,
    total,
    restaurantName,
    currency,
    payees,
    items,
    assignments,
    onShare,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Bill Breakdown</Text>
          <Text style={styles.subtitle}>Here's how much each person owes</Text>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Bill</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {currency.symbol}
              {subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tip</Text>
            <Text style={styles.summaryValue}>
              {currency.symbol}
              {tipAmount.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {currency.symbol}
              {total.toFixed(2)}
            </Text>
          </View>
        </Card>

        <View style={styles.payeesSection}>
          <Text style={styles.payeesTitle}>What Each Person Owes</Text>
          {Object.values(payeeTotals).map((payee, index) => (
            <Card key={index} style={styles.payeeCard}>
              <View
                style={styles.payeeHeader}
                accessible={true}
                accessibilityLabel={`${payee.name} owes ${currency.symbol}${payee.total.toFixed(2)}`}
              >
                <View style={styles.payeeInfo}>
                  <View
                    style={styles.payeeAvatar}
                    accessibilityLabel={`${payee.name} avatar`}
                  >
                    <Text style={styles.payeeInitial}>
                      {payee.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text
                    style={styles.payeeName}
                    accessibilityRole="header"
                    accessibilityLabel={payee.name}
                  >
                    {payee.name}
                  </Text>
                </View>
                <Text
                  style={styles.payeeTotal}
                  accessibilityLabel={`Total: ${currency.symbol}${payee.total.toFixed(2)}`}
                >
                  {currency.symbol}
                  {payee.total.toFixed(2)}
                </Text>
              </View>

              <View style={styles.payeeItems}>
                {payee.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemAmount}>
                      {currency.symbol}
                      {item.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.payeeBreakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Items</Text>
                  <Text style={styles.breakdownValue}>
                    {currency.symbol}
                    {payee.subtotal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Tip</Text>
                  <Text style={styles.breakdownValue}>
                    {currency.symbol}
                    {payee.tip.toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Share Breakdown"
            onPress={handleSharePDF}
            variant="primary"
            size="large"
            style={styles.shareButton}
          />
          <Button
            title="Start Over"
            onPress={onStartOver}
            variant="outline"
            size="large"
            style={styles.startOverButton}
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
  summaryCard: {
    marginBottom: theme.spacing.lg,
  },
  summaryTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
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
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: "bold",
  },
  totalValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  payeesSection: {
    marginBottom: theme.spacing.xl,
  },
  payeesTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  payeeCard: {
    marginBottom: theme.spacing.md,
  },
  payeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  payeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  payeeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  payeeInitial: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  payeeName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  payeeTotal: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  payeeItems: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemName: {
    ...theme.typography.caption,
    color: theme.colors.text,
    flex: 1,
  },
  itemAmount: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  payeeBreakdown: {
    marginTop: theme.spacing.sm,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  breakdownLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  breakdownValue: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: "600",
  },
  actionsSection: {
    marginTop: "auto",
    gap: theme.spacing.md,
  },
  shareButton: {
    marginBottom: theme.spacing.sm,
  },
  startOverButton: {
    marginBottom: theme.spacing.lg,
  },
});
