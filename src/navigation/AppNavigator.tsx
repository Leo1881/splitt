import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "../screens/SplashScreen";
import { PayeesScreen } from "../screens/PayeesScreen";
import { MockReceiptScreen } from "../screens/MockReceiptScreen";
import { ItemAssignmentScreen } from "../screens/ItemAssignmentScreen";
import { TipScreen } from "../screens/TipScreen";
import { ReviewScreen } from "../screens/ReviewScreen";
import { theme } from "../constants/theme";

const Stack = createStackNavigator();

interface Payee {
  id: string;
  name: string;
}

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
}

interface ItemAssignment {
  itemId: string;
  payees: Payee[];
  isSplit: boolean;
}

export const AppNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState("Splash");
  const [payees, setPayees] = useState<Payee[]>([]);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [assignments, setAssignments] = useState<ItemAssignment[]>([]);
  const [tipAmount, setTipAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  const handleSplashComplete = () => {
    setCurrentScreen("Payees");
  };

  const handlePayeesContinue = (payeesData: Payee[]) => {
    setPayees(payeesData);
    setCurrentScreen("MockReceipt");
  };

  const handleReceiptContinue = (receiptItems: ReceiptItem[]) => {
    setItems(receiptItems);
    setSubtotal(receiptItems.reduce((sum, item) => sum + item.price, 0));
    setCurrentScreen("ItemAssignment");
  };

  const handleItemAssignmentContinue = (itemAssignments: ItemAssignment[]) => {
    setAssignments(itemAssignments);
    setCurrentScreen("Tip");
  };

  const handleTipContinue = (tip: number, tipPercentage: number) => {
    setTipAmount(tip);
    setCurrentScreen("Review");
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log("Share breakdown");
  };

  const handleStartOver = () => {
    setCurrentScreen("Payees");
    setPayees([]);
    setItems([]);
    setAssignments([]);
    setTipAmount(0);
    setSubtotal(0);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "Splash":
        return <SplashScreen onComplete={handleSplashComplete} />;
      case "Payees":
        return <PayeesScreen onContinue={handlePayeesContinue} />;
      case "MockReceipt":
        return <MockReceiptScreen onContinue={handleReceiptContinue} />;
      case "ItemAssignment":
        return (
          <ItemAssignmentScreen
            items={items}
            payees={payees}
            onContinue={handleItemAssignmentContinue}
          />
        );
      case "Tip":
        return <TipScreen subtotal={subtotal} onContinue={handleTipContinue} />;
      case "Review":
        return (
          <ReviewScreen
            items={items}
            payees={payees}
            assignments={assignments}
            tipAmount={tipAmount}
            subtotal={subtotal}
            onShare={handleShare}
            onStartOver={handleStartOver}
          />
        );
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={() => renderCurrentScreen()} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
