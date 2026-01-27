import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { theme } from "../constants/theme";
import { Currency } from "../constants/currencies";
import { validateAndParse, tipSchema } from "../utils/validation";

interface TipScreenProps {
  subtotal: number;
  currency: Currency;
  onContinue: (tipAmount: number, tipPercentage: number) => void;
}

export const TipScreen: React.FC<TipScreenProps> = ({
  subtotal,
  currency,
  onContinue,
}) => {
  const [tipPercentage, setTipPercentage] = useState(10);
  const [customTip, setCustomTip] = useState("");
  const [useCustomTip, setUseCustomTip] = useState(false);

  const tipOptions = [10, 15, 20, 25];

  const { tipAmount, total } = useMemo(() => {
    const calculatedTip = useCustomTip
      ? parseFloat(customTip) || 0
      : (subtotal * tipPercentage) / 100;
    const calculatedTotal = subtotal + calculatedTip;
    return {
      tipAmount: calculatedTip,
      total: calculatedTotal,
    };
  }, [useCustomTip, customTip, subtotal, tipPercentage]);

  const handlePercentageChange = useCallback((percentage: number) => {
    setTipPercentage(percentage);
    setUseCustomTip(false);
    setCustomTip("");
  }, []);

  const handleCustomTipChange = useCallback((value: string) => {
    // Only allow numbers and decimal point
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    setCustomTip(cleanedValue);
    setUseCustomTip(true);
  }, []);

  const handleContinue = useCallback(() => {
    // Check if tip amount exceeds bill amount
    if (tipAmount > subtotal && subtotal > 0) {
      Alert.alert(
        "Tip Exceeds Bill Amount",
        `Your tip of ${currency.symbol}${tipAmount.toFixed(2)} exceeds the bill amount of ${currency.symbol}${subtotal.toFixed(2)}. Are you sure you want to continue?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Continue",
            style: "default",
            onPress: () => {
              const validation = validateAndParse(tipSchema, {
                amount: tipAmount,
                percentage: useCustomTip
                  ? subtotal > 0
                    ? Math.round((tipAmount / subtotal) * 100)
                    : 0
                  : tipPercentage,
              });

              if (!validation.success) {
                // Tip validation failed, but we'll still continue
                // The validation is mainly for data integrity
              }

              const finalPercentage = useCustomTip
                ? subtotal > 0
                  ? Math.round((tipAmount / subtotal) * 100)
                  : 0
                : tipPercentage;

              onContinue(tipAmount, finalPercentage);
            },
          },
        ]
      );
      return;
    }

    const validation = validateAndParse(tipSchema, {
      amount: tipAmount,
      percentage: useCustomTip
        ? subtotal > 0
          ? Math.round((tipAmount / subtotal) * 100)
          : 0
        : tipPercentage,
    });

    if (!validation.success) {
      // Tip validation failed, but we'll still continue
      // The validation is mainly for data integrity
    }

    const finalPercentage = useCustomTip
      ? subtotal > 0
        ? Math.round((tipAmount / subtotal) * 100)
        : 0
      : tipPercentage;

    onContinue(tipAmount, finalPercentage);
  }, [tipAmount, tipPercentage, useCustomTip, subtotal, currency, onContinue]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add Tip</Text>
          <Text style={styles.subtitle}>How much would you like to tip?</Text>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Summary</Text>
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

        <Card style={styles.tipOptionsCard}>
          <Text style={styles.tipOptionsTitle}>Tip Options</Text>
          <View style={styles.tipButtonsContainer}>
            {tipOptions.map((percentage) => (
              <Button
                key={percentage}
                title={`${percentage}%`}
                onPress={() => handlePercentageChange(percentage)}
                variant={
                  tipPercentage === percentage && !useCustomTip
                    ? "primary"
                    : "outline"
                }
                size="medium"
                style={styles.tipButton}
                accessibilityLabel={`${percentage} percent tip`}
                accessibilityHint={`Sets tip to ${percentage}% of the subtotal`}
                accessibilityState={{
                  selected: tipPercentage === percentage && !useCustomTip,
                }}
              />
            ))}
          </View>

          <View style={styles.customTipSection}>
            <Text style={styles.customTipLabel}>Custom Tip Amount</Text>
            <View style={styles.customTipContainer}>
              <Text style={styles.dollarSign}>{currency.symbol}</Text>
              <TextInput
                style={styles.customTipInput}
                placeholder="0.00"
                value={customTip}
                onChangeText={handleCustomTipChange}
                keyboardType="decimal-pad"
                placeholderTextColor={theme.colors.textSecondary}
                accessibilityLabel="Custom tip amount"
                accessibilityHint="Enter a custom tip amount in the selected currency"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.tipInfo}>
            <Text style={styles.tipInfoText}>
              💡 Tip will be split equally among all participants
            </Text>
          </View>
        </Card>

        <View style={styles.continueSection}>
          <Button
            title="Continue to Review"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueButton}
            accessibilityLabel="Continue to review screen"
            accessibilityHint="Proceeds to the final review screen with tip included"
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
  tipOptionsCard: {
    marginBottom: theme.spacing.lg,
  },
  tipOptionsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tipButtonsContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tipButton: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  customTipSection: {
    marginTop: theme.spacing.md,
  },
  customTipLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: "600",
  },
  customTipContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    marginTop: theme.spacing.sm,
  },
  dollarSign: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  customTipInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text,
  },
  tipInfo: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
  },
  tipInfoText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  continueSection: {
    marginTop: theme.spacing.lg,
  },
  continueButton: {
    marginBottom: theme.spacing.lg,
  },
});
