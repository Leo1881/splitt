import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "../screens/SplashScreen";
import { PayeesScreen } from "../screens/PayeesScreen";
import { CameraScreen } from "../screens/CameraScreen";
import { MockReceiptScreen } from "../screens/MockReceiptScreen";
import { ItemAssignmentScreen } from "../screens/ItemAssignmentScreen";
import { TipScreen } from "../screens/TipScreen";
import { ReviewScreen } from "../screens/ReviewScreen";
import { theme } from "../constants/theme";
import { Currency, DEFAULT_CURRENCY } from "../constants/currencies";

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
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>(DEFAULT_CURRENCY);
  const [restaurantName, setRestaurantName] = useState("");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const handleSplashComplete = () => {
    setCurrentScreen("Payees");
  };

  const handlePayeesContinue = (
    payeesData: Payee[],
    currency: Currency,
    restaurant: string
  ) => {
    setPayees(payeesData);
    setSelectedCurrency(currency);
    setRestaurantName(restaurant);
    setCurrentScreen("Camera");
  };

  const handlePhotoTaken = (photoUri: string) => {
    setCapturedPhoto(photoUri);
    setCurrentScreen("MockReceipt");
  };

  const handleCameraBack = () => {
    setCurrentScreen("Payees");
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
    setSelectedCurrency(DEFAULT_CURRENCY);
    setRestaurantName("");
  };

  const handleReceiptBack = () => {
    setCurrentScreen("Payees");
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "Splash":
        return <SplashScreen onComplete={handleSplashComplete} />;
      case "Payees":
        return (
          <PayeesScreen
            onContinue={handlePayeesContinue}
            initialPayees={payees}
          />
        );
      case "Camera":
        return (
          <CameraScreen
            onPhotoTaken={handlePhotoTaken}
            onBack={handleCameraBack}
          />
        );
      case "MockReceipt":
        return (
          <MockReceiptScreen
            currency={selectedCurrency}
            restaurantName={restaurantName}
            onContinue={handleReceiptContinue}
            onBack={handleReceiptBack}
          />
        );
      case "ItemAssignment":
        return (
          <ItemAssignmentScreen
            items={items}
            payees={payees}
            currency={selectedCurrency}
            onContinue={handleItemAssignmentContinue}
          />
        );
      case "Tip":
        return (
          <TipScreen
            subtotal={subtotal}
            currency={selectedCurrency}
            onContinue={handleTipContinue}
          />
        );
      case "Review":
        return (
          <ReviewScreen
            items={items}
            payees={payees}
            assignments={assignments}
            tipAmount={tipAmount}
            subtotal={subtotal}
            currency={selectedCurrency}
            restaurantName={restaurantName}
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
