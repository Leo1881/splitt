import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { theme } from "../constants/theme";

interface Payee {
  id: string;
  name: string;
}

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ItemAssignment {
  itemId: string;
  payees: Payee[];
  isSplit: boolean;
  quantities?: { [payeeId: string]: number };
}

interface ReviewScreenProps {
  items: ReceiptItem[];
  payees: Payee[];
  assignments: ItemAssignment[];
  tipAmount: number;
  subtotal: number;
  onShare: () => void;
  onStartOver: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  items,
  payees,
  assignments,
  tipAmount,
  subtotal,
  onShare,
  onStartOver,
}) => {
  const calculatePayeeTotals = () => {
    const payeeTotals: {
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
      payeeTotals[payee.id] = {
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
            payeeTotals[payee.id].subtotal += amount;
            payeeTotals[payee.id].items.push({
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
          payeeTotals[payee.id].subtotal += pricePerPerson;
          payeeTotals[payee.id].items.push({
            name:
              item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name,
            quantity: 1,
            amount: pricePerPerson,
          });
        });
      } else if (assignment.payees.length > 0) {
        // Single assignment
        const payee = assignment.payees[0];
        payeeTotals[payee.id].subtotal += item.price;
        payeeTotals[payee.id].items.push({
          name:
            item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name,
          quantity: item.quantity,
          amount: item.price,
        });
      }
    });

    // Calculate tip per person
    const tipPerPerson = tipAmount / payees.length;
    Object.keys(payeeTotals).forEach((payeeId) => {
      payeeTotals[payeeId].tip = tipPerPerson;
      payeeTotals[payeeId].total =
        payeeTotals[payeeId].subtotal + payeeTotals[payeeId].tip;
    });

    return payeeTotals;
  };

  const payeeTotals = calculatePayeeTotals();
  const total = subtotal + tipAmount;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Bill Breakdown</Text>
          <Text style={styles.subtitle}>Here's how much each person owes</Text>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Bill</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tip</Text>
            <Text style={styles.summaryValue}>R{tipAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R{total.toFixed(2)}</Text>
          </View>
        </Card>

        <View style={styles.payeesSection}>
          <Text style={styles.payeesTitle}>What Each Person Owes</Text>
          {Object.values(payeeTotals).map((payee, index) => (
            <Card key={index} style={styles.payeeCard}>
              <View style={styles.payeeHeader}>
                <View style={styles.payeeInfo}>
                  <View style={styles.payeeAvatar}>
                    <Text style={styles.payeeInitial}>
                      {payee.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.payeeName}>{payee.name}</Text>
                </View>
                <Text style={styles.payeeTotal}>R{payee.total.toFixed(2)}</Text>
              </View>

              <View style={styles.payeeItems}>
                {payee.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemAmount}>
                      R{item.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.payeeBreakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Items</Text>
                  <Text style={styles.breakdownValue}>
                    R{payee.subtotal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Tip</Text>
                  <Text style={styles.breakdownValue}>
                    R{payee.tip.toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Share Breakdown"
            onPress={onShare}
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
  itemsSection: {
    marginBottom: theme.spacing.xl,
  },
  itemsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  itemCard: {
    marginBottom: theme.spacing.sm,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  itemName: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  itemPrice: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  itemAssignment: {
    marginTop: theme.spacing.sm,
  },
  splitAssignment: {
    flexDirection: "row",
    alignItems: "center",
  },
  splitText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  singleAssignment: {
    flexDirection: "row",
    alignItems: "center",
  },
  singleText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
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
