import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
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

interface ItemAssignmentScreenProps {
  items: ReceiptItem[];
  payees: Payee[];
  onContinue: (assignments: ItemAssignment[]) => void;
}

export const ItemAssignmentScreen: React.FC<ItemAssignmentScreenProps> = ({
  items,
  payees,
  onContinue,
}) => {
  const [assignments, setAssignments] = useState<ItemAssignment[]>(
    items.map((item) => ({
      itemId: item.id,
      payees: [],
      isSplit: false,
    }))
  );
  const [selectedItem, setSelectedItem] = useState<ReceiptItem | null>(null);
  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [selectedPayees, setSelectedPayees] = useState<Payee[]>([]);
  const [payeeQuantities, setPayeeQuantities] = useState<{
    [payeeId: string]: number;
  }>({});

  const getAssignment = (itemId: string) => {
    return assignments.find((a) => a.itemId === itemId);
  };

  const assignToSinglePayee = (itemId: string, payee: Payee) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.itemId === itemId
          ? { itemId, payees: [payee], isSplit: false }
          : assignment
      )
    );
  };

  const openSplitModal = (item: ReceiptItem) => {
    setSelectedItem(item);
    setSelectedPayees([]);
    setPayeeQuantities({});
    setSplitModalVisible(true);
  };

  const handleSplitAssignment = () => {
    if (!selectedItem || selectedPayees.length < 2) return;

    // Only validate quantities for items with quantity > 1
    if (selectedItem.quantity > 1) {
      const totalAssigned = Object.values(payeeQuantities).reduce(
        (sum, qty) => sum + qty,
        0
      );
      if (totalAssigned !== selectedItem.quantity) {
        Alert.alert(
          "Invalid Quantities",
          `Total assigned (${totalAssigned}) must equal item quantity (${selectedItem.quantity})`
        );
        return;
      }
    }

    setAssignments(
      assignments.map((assignment) =>
        assignment.itemId === selectedItem.id
          ? {
              itemId: selectedItem.id,
              payees: selectedPayees,
              isSplit: true,
              quantities: payeeQuantities,
            }
          : assignment
      )
    );
    setSplitModalVisible(false);
    setSelectedItem(null);
    setSelectedPayees([]);
    setPayeeQuantities({});
  };

  const togglePayeeSelection = (payee: Payee) => {
    setSelectedPayees((prev) => {
      const isSelected = prev.some((p) => p.id === payee.id);
      if (isSelected) {
        // Remove from selection and clear quantity
        const newQuantities = { ...payeeQuantities };
        delete newQuantities[payee.id];
        setPayeeQuantities(newQuantities);
        return prev.filter((p) => p.id !== payee.id);
      } else {
        // Add to selection and set quantity to 0
        setPayeeQuantities((prev) => ({ ...prev, [payee.id]: 0 }));
        return [...prev, payee];
      }
    });
  };

  const updatePayeeQuantity = (payeeId: string, quantity: number) => {
    if (quantity < 0) return;
    setPayeeQuantities((prev) => ({ ...prev, [payeeId]: quantity }));
  };

  const getAssignmentText = (assignment: ItemAssignment) => {
    if (assignment.payees.length === 0) {
      return "Select person";
    } else if (assignment.isSplit) {
      const item = items.find((i) => i.id === assignment.itemId);
      if (!item) return "Split between multiple people";

      if (assignment.quantities && item.quantity > 1) {
        // Show individual quantities for multiple items
        const assignments = assignment.payees.map((payee) => {
          const quantity = assignment.quantities![payee.id] || 0;
          return `${payee.name} (${quantity})`;
        });
        return assignments.join(", ");
      } else {
        // Fallback to equal split
        const names = assignment.payees.map((p) => p.name).join(", ");
        // For single items, just show names without price
        if (item.quantity === 1) {
          return names;
        } else {
          const pricePerPerson = item.price / assignment.payees.length;
          return `Split between ${names} - R${pricePerPerson.toFixed(2)} each`;
        }
      }
    } else {
      return assignment.payees[0].name;
    }
  };

  const handleContinue = () => {
    const unassignedItems = assignments.filter((a) => a.payees.length === 0);
    if (unassignedItems.length > 0) {
      Alert.alert(
        "Incomplete Assignment",
        "Please assign all items to people before continuing."
      );
      return;
    }
    onContinue(assignments);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Assign Items</Text>
          <Text style={styles.subtitle}>
            Assign each item to the person who ordered it
          </Text>
        </View>

        <View style={styles.itemsContainer}>
          {items.map((item) => {
            const assignment = getAssignment(item.id);
            return (
              <Card key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>
                    {item.quantity > 1
                      ? `${item.name} x${item.quantity}`
                      : item.name}
                  </Text>
                  <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                </View>

                <View style={styles.assignmentRow}>
                  <TouchableOpacity
                    style={styles.assignButton}
                    onPress={() => {
                      setSelectedItem(item);
                      setSplitModalVisible(false);
                    }}
                  >
                    <Text style={styles.assignButtonText}>
                      {getAssignmentText(assignment!)}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.splitButton}
                    onPress={() => openSplitModal(item)}
                  >
                    <Ionicons
                      name="people"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
        </View>

        <View style={styles.continueSection}>
          <Button
            title="Continue to Add Tip"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueButton}
          />
        </View>
      </ScrollView>

      {/* Assignment Modal */}
      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedItem?.quantity && selectedItem.quantity > 1
                ? `${selectedItem.name} x${selectedItem.quantity}`
                : selectedItem?.name}
              {" - R" + selectedItem?.price.toFixed(2)}
            </Text>
            <Text style={styles.modalSubtitle}>Who ordered this item?</Text>

            <View style={styles.payeesList}>
              {payees.map((payee) => (
                <TouchableOpacity
                  key={payee.id}
                  style={styles.payeeOption}
                  onPress={() => {
                    if (selectedItem) {
                      assignToSinglePayee(selectedItem.id, payee);
                      setSelectedItem(null);
                    }
                  }}
                >
                  <View style={styles.payeeInfo}>
                    <View style={styles.payeeAvatar}>
                      <Text style={styles.payeeInitial}>
                        {payee.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.payeeName}>{payee.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setSelectedItem(null)}
                variant="outline"
                size="medium"
                style={styles.cancelButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Split Modal */}
      <Modal
        visible={splitModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSplitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedItem?.quantity && selectedItem.quantity > 1
                ? `${selectedItem.name} x${selectedItem.quantity}`
                : selectedItem?.name}
              {" - R" + selectedItem?.price.toFixed(2)}
            </Text>
            <Text style={styles.modalSubtitle}>Who's sharing this item?</Text>

            <ScrollView
              style={styles.payeesScrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.payeesList}>
                {payees.map((payee) => {
                  const isSelected = selectedPayees.some(
                    (p) => p.id === payee.id
                  );
                  const quantity = payeeQuantities[payee.id] || 0;

                  return (
                    <View key={payee.id} style={styles.payeeRow}>
                      <TouchableOpacity
                        style={[
                          styles.payeeOption,
                          isSelected && styles.selectedPayee,
                        ]}
                        onPress={() => togglePayeeSelection(payee)}
                      >
                        <View style={styles.payeeInfo}>
                          <View style={styles.payeeAvatar}>
                            <Text style={styles.payeeInitial}>
                              {payee.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <Text style={styles.payeeName}>{payee.name}</Text>
                        </View>
                        <Ionicons
                          name={
                            isSelected
                              ? "checkmark-circle"
                              : "checkmark-circle-outline"
                          }
                          size={24}
                          color={
                            isSelected
                              ? theme.colors.primary
                              : theme.colors.textSecondary
                          }
                        />
                      </TouchableOpacity>

                      {isSelected &&
                        selectedItem &&
                        selectedItem.quantity > 1 && (
                          <View style={styles.quantityContainer}>
                            <Text style={styles.quantityLabel}>Quantity:</Text>
                            <View style={styles.quantityInputContainer}>
                              <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() =>
                                  updatePayeeQuantity(
                                    payee.id,
                                    Math.max(0, quantity - 1)
                                  )
                                }
                              >
                                <Ionicons
                                  name="remove-outline"
                                  size={16}
                                  color="white"
                                />
                              </TouchableOpacity>
                              <TextInput
                                style={styles.quantityInput}
                                value={quantity.toString()}
                                onChangeText={(text) => {
                                  const newQuantity = parseInt(text) || 1;
                                  updatePayeeQuantity(payee.id, newQuantity);
                                }}
                                keyboardType="numeric"
                                selectTextOnFocus
                              />
                              <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() =>
                                  updatePayeeQuantity(payee.id, quantity + 1)
                                }
                              >
                                <Ionicons
                                  name="add-outline"
                                  size={16}
                                  color="white"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setSplitModalVisible(false);
                  setSelectedItem(null);
                  setSelectedPayees([]);
                }}
                variant="outline"
                size="medium"
                style={styles.cancelButton}
              />
              <Button
                title={`Split Item (${selectedPayees.length})`}
                onPress={handleSplitAssignment}
                variant="primary"
                size="medium"
                style={styles.splitConfirmButton}
                disabled={selectedPayees.length < 2}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  itemsContainer: {
    marginBottom: theme.spacing.xl,
    overflow: "visible",
  },
  itemCard: {
    marginBottom: theme.spacing.md,
    overflow: "visible",
    zIndex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  itemName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
  },
  itemPrice: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  assignmentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  assignButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  assignButtonText: {
    ...theme.typography.body,
    color: "white",
    flex: 1,
    fontWeight: "600",
  },
  portalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  dropdownList: {
    position: "absolute",
    top: 200, // Adjust this based on your layout
    left: 20,
    right: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
  },
  dropdownItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  splitItem: {
    backgroundColor: theme.colors.surface,
  },
  splitButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  dropdownModal: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  continueSection: {
    marginTop: "auto",
  },
  continueButton: {
    marginBottom: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: "100%",
    maxHeight: "90%",
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  payeesScrollView: {
    maxHeight: 400,
    marginBottom: theme.spacing.lg,
  },
  payeesList: {
    marginBottom: theme.spacing.lg,
  },
  payeeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedPayee: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
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
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  splitConfirmButton: {
    flex: 1,
  },
  payeeRow: {
    marginBottom: theme.spacing.sm,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  quantityLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  quantityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
});
