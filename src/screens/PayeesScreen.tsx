import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { theme } from "../constants/theme";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  Currency,
} from "../constants/currencies";

interface Payee {
  id: string;
  name: string;
}

interface PayeesScreenProps {
  onContinue: (
    payees: Payee[],
    selectedCurrency: Currency,
    restaurantName: string
  ) => void;
  initialPayees?: Payee[];
}

export const PayeesScreen: React.FC<PayeesScreenProps> = ({
  onContinue,
  initialPayees = [],
}) => {
  const [payees, setPayees] = useState<Payee[]>(initialPayees);
  const [newPayeeName, setNewPayeeName] = useState("");
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>(DEFAULT_CURRENCY);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");

  const addPayee = () => {
    if (!newPayeeName.trim()) {
      Alert.alert("Error", "Please enter a name");
      return;
    }

    const newPayee: Payee = {
      id: Date.now().toString(),
      name: newPayeeName.trim(),
    };

    setPayees([...payees, newPayee]);
    setNewPayeeName("");
  };

  const removePayee = (id: string) => {
    setPayees(payees.filter((payee) => payee.id !== id));
  };

  const handleContinue = () => {
    if (payees.length === 0) {
      Alert.alert(
        "Error",
        "Please add at least one person to split the bill with"
      );
      return;
    }
    if (!restaurantName.trim()) {
      Alert.alert("Error", "Please enter the restaurant name");
      return;
    }
    onContinue(payees, selectedCurrency, restaurantName.trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Who's splitting the bill?</Text>
          <Text style={styles.subtitle}>
            Add the people you're splitting the bill with
          </Text>
        </View>

        <Card style={styles.restaurantCard}>
          <Text style={styles.restaurantTitle}>Restaurant Name</Text>
          <TextInput
            style={styles.restaurantInput}
            placeholder="Enter restaurant name"
            value={restaurantName}
            onChangeText={setRestaurantName}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </Card>

        <Card style={styles.addPayeeCard}>
          <Text style={styles.addPayeeTitle}>Who's Paying</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={newPayeeName}
            onChangeText={setNewPayeeName}
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Button
            title="Add Person"
            onPress={addPayee}
            variant="primary"
            size="medium"
            style={styles.addButton}
          />
        </Card>

        {payees.length > 0 && (
          <View style={styles.payeesList}>
            <Text style={styles.payeesTitle}>People ({payees.length})</Text>
            {payees.map((payee) => (
              <Card key={payee.id} style={styles.payeeCard}>
                <View style={styles.payeeInfo}>
                  <View style={styles.payeeAvatar}>
                    <Text style={styles.payeeInitial}>
                      {payee.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.payeeDetails}>
                    <Text style={styles.payeeName}>{payee.name}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePayee(payee.id)}
                >
                  <Ionicons name="close" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}

        <Card style={styles.currencyCard}>
          <Text style={styles.currencyTitle}>Currency</Text>
          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
          >
            <View style={styles.currencyInfo}>
              <Text style={styles.currencySymbol}>
                {selectedCurrency.symbol}
              </Text>
              <View style={styles.currencyDetails}>
                <Text style={styles.currencyCode}>{selectedCurrency.code}</Text>
                <Text style={styles.currencyName}>{selectedCurrency.name}</Text>
              </View>
            </View>
            <Ionicons
              name={showCurrencyPicker ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {showCurrencyPicker && (
            <ScrollView
              style={styles.currencyPicker}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {CURRENCIES.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    selectedCurrency.code === currency.code &&
                      styles.selectedCurrencyOption,
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text style={styles.currencyOptionSymbol}>
                    {currency.symbol}
                  </Text>
                  <View style={styles.currencyOptionDetails}>
                    <Text style={styles.currencyOptionCode}>
                      {currency.code}
                    </Text>
                    <Text style={styles.currencyOptionName}>
                      {currency.name}
                    </Text>
                  </View>
                  {selectedCurrency.code === currency.code && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </Card>

        <View style={styles.continueSection}>
          <Button
            title="Continue to Scan Receipt"
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={payees.length === 0}
            style={styles.continueButton}
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
  addPayeeCard: {
    marginBottom: theme.spacing.lg,
  },
  addPayeeTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  addButton: {
    marginTop: theme.spacing.sm,
  },
  payeesList: {
    marginBottom: theme.spacing.xl,
  },
  payeesTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  payeeCard: {
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  payeeInitial: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  payeeDetails: {
    flex: 1,
  },
  payeeName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  continueSection: {
    marginTop: "auto",
  },
  continueButton: {
    marginBottom: theme.spacing.lg,
  },
  currencyCard: {
    marginBottom: theme.spacing.lg,
  },
  currencyTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  currencyInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  currencySymbol: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: "bold",
    marginRight: theme.spacing.md,
    minWidth: 40,
  },
  currencyDetails: {
    flex: 1,
  },
  currencyCode: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  currencyName: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  currencyPicker: {
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    maxHeight: 300,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedCurrencyOption: {
    backgroundColor: theme.colors.surface,
  },
  currencyOptionSymbol: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: "bold",
    marginRight: theme.spacing.md,
    minWidth: 40,
  },
  currencyOptionDetails: {
    flex: 1,
  },
  currencyOptionCode: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  currencyOptionName: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  restaurantCard: {
    marginBottom: theme.spacing.lg,
  },
  restaurantTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  restaurantInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
});
