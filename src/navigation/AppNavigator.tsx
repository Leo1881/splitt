import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SplashScreen } from "../screens/SplashScreen";
import { PayeesScreen } from "../screens/PayeesScreen";
import { CameraScreen } from "../screens/CameraScreen";
import { OCRProcessingScreen } from "../screens/OCRProcessingScreen";
import { OCRDataScreen } from "../screens/OCRDataScreen";
import { MockReceiptScreen } from "../screens/MockReceiptScreen";
import { ItemAssignmentScreen } from "../screens/ItemAssignmentScreen";
import { TipScreen } from "../screens/TipScreen";
import { ReviewScreen } from "../screens/ReviewScreen";
import { theme } from "../constants/theme";
import { Currency, DEFAULT_CURRENCY } from "../constants/currencies";
import {
  Payee,
  ReceiptItem,
  ItemAssignment,
  ExtractedReceiptData,
} from "../types";

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
  const [extractedData, setExtractedData] =
    useState<ExtractedReceiptData | null>(null);

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
    setCurrentScreen("OCRProcessing");
  };

  const handleCameraBack = () => {
    setCurrentScreen("Payees");
  };

  const handleOCRComplete = (data: ExtractedReceiptData) => {
    setExtractedData(data);
    setCurrentScreen("MockReceipt");
  };

  const handleReceiptContinue = (receiptItems: ReceiptItem[]) => {
    // Always use the passed receiptItems (from MockReceiptScreen or OCR)
    // This ensures mock data matches what's shown on the assignment screen
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

  const handleShare = async () => {
    // Share functionality is handled in ReviewScreen via PDF generation
    // This is kept as a fallback if PDF sharing fails
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
    setCapturedPhoto(null);
    setExtractedData(null);
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
      case "OCRProcessing":
        return (
          <OCRProcessingScreen
            imageUri={capturedPhoto || ""}
            onProcessingComplete={handleOCRComplete}
            onBack={handleCameraBack}
          />
        );
      case "OCRData":
        return (
          <OCRDataScreen
            extractedData={extractedData}
            onContinue={() => setCurrentScreen("MockReceipt")}
            onBack={() => setCurrentScreen("MockReceipt")}
          />
        );
      case "MockReceipt":
        return (
          <MockReceiptScreen
            currency={selectedCurrency}
            restaurantName={extractedData?.restaurantName || restaurantName}
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
      {renderCurrentScreen()}
    </NavigationContainer>
  );
};
