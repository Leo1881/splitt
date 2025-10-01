import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
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

interface PayeesScreenProps {
  onContinue: (payees: Payee[]) => void;
}

export const PayeesScreen: React.FC<PayeesScreenProps> = ({ onContinue }) => {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [newPayeeName, setNewPayeeName] = useState("");

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
    onContinue(payees);
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
});
